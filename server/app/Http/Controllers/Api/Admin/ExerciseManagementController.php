<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExerciseFormRequest;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExerciseManagementController extends Controller
{
    public function show(Exercise $exercise): ExerciseResource
    {
        $exercise->load(['categories:id,name,user_id', 'user:id,name']);
        $exercise->loadCount('favouritedByUsers');

        return new ExerciseResource($exercise);
    }

    public function index(Request $request)
    {
        $perPage = max(1, min(50, $request->integer('per_page', 12)));
        $query = $request->boolean('include_deleted')
            ? Exercise::withTrashed()
            : Exercise::query();

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $exercises = $query
            ->with(['categories:id,name,user_id', 'user:id,name'])
            ->withCount('favouritedByUsers')
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return ExerciseResource::collection($exercises);
    }

    public function update(ExerciseFormRequest $request, Exercise $exercise): ExerciseResource
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('images', 'public');
        }

        $exercise->update($validated);
        $exercise->categories()->sync($validated['categories'] ?? []);

        $exercise->load(['categories:id,name,user_id', 'user:id,name']);
        $exercise->loadCount('favouritedByUsers');

        return new ExerciseResource($exercise);
    }

    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->delete();

        return response()->json([], 204);
    }
}
