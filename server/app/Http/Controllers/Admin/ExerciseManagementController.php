<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExerciseFormRequest;
use App\Models\Category;
use App\Models\Exercise;

class ExerciseManagementController extends Controller
{
    public function index()
    {
        $exercises = Exercise::query()
            ->with(['user', 'categories'])
            ->latest()
            ->get();

        return view('admin.exercises.index', [
            'exercises' => $exercises,
        ]);
    }

    public function edit(Exercise $exercise)
    {
        return view('admin.exercises.edit', [
            'exercise' => $exercise->load('categories', 'user'),
            'categories' => Category::query()->orderBy('name')->get(),
        ]);
    }

    public function update(ExerciseFormRequest $request, Exercise $exercise)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('images', 'public');
        }

        $exercise->update($validated);
        $exercise->categories()->sync($validated['categories'] ?? []);

        return redirect()
            ->route('admin.exercises.index')
            ->with('status', 'Exercise updated.');
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return redirect()
            ->route('admin.exercises.index')
            ->with('status', 'Exercise deleted.');
    }
}
