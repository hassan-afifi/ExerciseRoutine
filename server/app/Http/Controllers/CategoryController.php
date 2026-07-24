<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Auth::user()
            ->categories()
            ->withCount('exercises')
            ->orderBy('name')
            ->get();

        return view('categories.index', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        Auth::user()->categories()->create($request->validated());

        return redirect()->route('categories.index');
    }

    public function edit(Category $category)
    {
        abort_unless($category->user_id === Auth::id(), 403);

        return view('categories.edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        abort_unless($category->user_id === Auth::id(), 403);

        $category->update($request->validated());

        return redirect()->route('categories.index');
    }

    public function destroy(Category $category)
    {
        abort_unless($category->user_id === Auth::id(), 403);

        $category->delete();

        return redirect()->route('categories.index');
    }
}
