<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExerciseFormRequest;
use App\Models\Category;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ExerciseController extends Controller
{
    public function landing(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $selectedCategoryIds = collect($request->query('categories', []))
            ->filter(fn ($value) => is_numeric($value))
            ->map(fn ($value) => (int) $value)
            ->values()
            ->all();

        $query = Exercise::query()->with('categories')->latest();

        if ($search !== '') {
            $query->where('title', 'like', '%' . $search . '%');
        }

        if (! empty($selectedCategoryIds)) {
            $query->whereHas('categories', function ($builder) use ($selectedCategoryIds) {
                $builder->whereIn('categories.id', $selectedCategoryIds);
            });
        }

        $user = Auth::user();
        $myExercisesCount = null;
        $favouritesCount = null;
        $myCategoriesCount = null;

        if ($user) {
            $myExercisesCount = $user->exercises()->count();
            $favouritesCount = $user->favouriteExercises()->count();
            $myCategoriesCount = $user->categories()->count();
        }

        return view('landing', [
            'exercises' => $query->get(),
            'categories' => Category::query()->orderBy('name')->get(),
            'search' => $search,
            'selectedCategoryIds' => $selectedCategoryIds,
            'myExercisesCount' => $myExercisesCount,
            'favouritesCount' => $favouritesCount,
            'myCategoriesCount' => $myCategoriesCount,
        ]);
    }

    public function index()
    {
        $exercises = Auth::user()
            ->exercises()
            ->with('categories')
            ->latest()
            ->get();

        return view('exercises.index', [
            'exercises' => $exercises,
        ]);
    }

    public function show(Exercise $exercise)
    {
        $exercise->load('categories', 'user');
        $isFavourite = Auth::check()
            ? Auth::user()->favouriteExercises()->whereKey($exercise->id)->exists()
            : false;

        return view('exercises.detail', [
            'exercise' => $exercise,
            'isFavourite' => $isFavourite,
        ]);
    }

    public function create()
    {
        return view('exercises.create', [
            'categories' => Category::query()->orderBy('name')->get(),
        ]);
    }

    public function store(ExerciseFormRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('images', 'public');
        }

        $exercise = Auth::user()->exercises()->create($validated);

        $exercise->categories()->sync($validated['categories'] ?? []);

        return redirect()->route('exercises.show', ['exercise' => $exercise->id]);
    }

    public function edit(Exercise $exercise)
    {
        Gate::authorize('access-exercise', $exercise);

        return view('exercises.edit', [
            'exercise' => $exercise->load('categories'),
            'categories' => Category::query()->orderBy('name')->get(),
        ]);
    }

    public function update(ExerciseFormRequest $request, Exercise $exercise)
    {
        Gate::authorize('access-exercise', $exercise);

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('images', 'public');
        }

        $exercise->update($validated);
        $exercise->categories()->sync($validated['categories'] ?? []);

        return redirect()->route('exercises.show', ['exercise' => $exercise->id]);
    }

    public function destroy(Exercise $exercise)
    {
        Gate::authorize('access-exercise', $exercise);

        $exercise->delete();

        return redirect()->route('exercises.index');
    }

    public function favourites()
    {
        $exercises = Auth::user()
            ->favouriteExercises()
            ->with('categories')
            ->orderByPivot('created_at', 'desc')
            ->get();

        return view('favourites.index', [
            'exercises' => $exercises,
        ]);
    }

    public function favourite(Exercise $exercise)
    {
        Auth::user()->favouriteExercises()->syncWithoutDetaching([$exercise->id]);

        return back();
    }

    public function unfavourite(Exercise $exercise)
    {
        Auth::user()->favouriteExercises()->detach($exercise->id);

        return back();
    }
}
