<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExerciseFormRequest;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $perPage = max(1, min(50, $request->integer('per_page', 12)));
        $exercises = $this->queryWithFilters($request)
            ->paginate($perPage)
            ->withQueryString();

        return ExerciseResource::collection($exercises);
    }

    public function show(Request $request, Exercise $exercise): ExerciseResource
    {
        $exercise->load(['categories:id,name,user_id', 'user:id,name']);
        $exercise->loadCount('favouritedByUsers');
        $exercise->setAttribute('is_favourite', $this->isFavourite($request, $exercise));

        return new ExerciseResource($exercise);
    }

    public function myExercises(Request $request)
    {
        $perPage = max(1, min(50, $request->integer('per_page', 12)));
        $query = $request->user()
            ->exercises()
            ->with(['categories:id,name,user_id', 'user:id,name'])
            ->withCount('favouritedByUsers')
            ->latest();

        $exercises = $query->paginate($perPage)->withQueryString();
        $exercises->getCollection()->each(fn (Exercise $exercise) => $exercise->setAttribute('is_favourite', $this->isFavourite($request, $exercise)));

        return ExerciseResource::collection($exercises);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'all_exercises_count' => Exercise::count(),
            'my_exercises_count' => $user->exercises()->count(),
            'favourites_count' => $user->favouriteExercises()->count(),
            'my_categories_count' => $user->categories()->count(),
        ]);
    }

    public function store(ExerciseFormRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('images', 'public');
        }

        $exercise = $request->user()->exercises()->create($validated);
        $exercise->categories()->sync($validated['categories'] ?? []);

        $exercise->load(['categories:id,name,user_id', 'user:id,name']);
        $exercise->loadCount('favouritedByUsers');
        $exercise->setAttribute('is_favourite', false);

        return (new ExerciseResource($exercise))
            ->response()
            ->setStatusCode(201);
    }

    public function update(ExerciseFormRequest $request, Exercise $exercise): ExerciseResource
    {
        $this->authorizeExerciseAccess($request, $exercise);

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('images', 'public');
        }

        $exercise->update($validated);
        $exercise->categories()->sync($validated['categories'] ?? []);

        $exercise->load(['categories:id,name,user_id', 'user:id,name']);
        $exercise->loadCount('favouritedByUsers');
        $exercise->setAttribute('is_favourite', $this->isFavourite($request, $exercise));

        return new ExerciseResource($exercise);
    }

    public function destroy(Request $request, Exercise $exercise): JsonResponse
    {
        $this->authorizeExerciseAccess($request, $exercise);
        $exercise->delete();

        return response()->json([], 204);
    }

    private function queryWithFilters(Request $request): Builder
    {
        $search = trim((string) $request->query('search', ''));
        $difficultyFilter = $this->parseArrayFilter($request->query('difficulty'));
        $muscleFilter = $this->parseArrayFilter($request->query('muscle'));
        $equipmentFilter = $this->parseArrayFilter($request->query('equipment'));
        $categoryIds = collect($this->parseArrayFilter($request->query('categories')))
            ->filter(fn ($value) => is_numeric($value))
            ->map(fn ($value) => (int) $value)
            ->values()
            ->all();

        $query = Exercise::query()
            ->with(['categories:id,name,user_id', 'user:id,name'])
            ->withCount('favouritedByUsers')
            ->latest();

        if ($request->user()) {
            $query->withExists([
                'favouritedByUsers as is_favourite' => function (Builder $builder) use ($request) {
                    $builder->where('users.id', $request->user()->id);
                },
            ]);
        }

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if (! empty($difficultyFilter)) {
            $query->whereIn('difficulty', $difficultyFilter);
        }

        if (! empty($muscleFilter)) {
            $query->whereIn('muscle', $muscleFilter);
        }

        if (! empty($equipmentFilter)) {
            $query->whereIn('equipment', $equipmentFilter);
        }

        if (! empty($categoryIds)) {
            $query->whereHas('categories', function (Builder $builder) use ($categoryIds) {
                $builder->whereIn('categories.id', $categoryIds);
            });
        }

        return $query;
    }

    private function parseArrayFilter(mixed $rawFilter): array
    {
        if (is_array($rawFilter)) {
            return array_values(array_filter($rawFilter, fn ($value) => $value !== null && $value !== ''));
        }

        if (is_string($rawFilter) && $rawFilter !== '') {
            return array_values(array_filter(array_map('trim', explode(',', $rawFilter))));
        }

        return [];
    }

    private function authorizeExerciseAccess(Request $request, Exercise $exercise): void
    {
        $user = $request->user();
        $canAccess = $user && ($user->is_admin || $exercise->user_id === $user->id);

        abort_unless($canAccess, 403);
    }

    private function isFavourite(Request $request, Exercise $exercise): bool
    {
        if (! $request->user()) {
            return false;
        }

        return $request->user()
            ->favouriteExercises()
            ->whereKey($exercise->id)
            ->exists();
    }
}
