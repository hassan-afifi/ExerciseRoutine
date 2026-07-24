<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function publicIndex()
    {
        $categories = Category::query()
            ->withCount('exercises')
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function index(Request $request)
    {
        $categories = $request->user()
            ->categories()
            ->withCount('exercises')
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(Request $request, Category $category): CategoryResource
    {
        abort_unless($category->user_id === $request->user()->id, 403);
        $category->loadCount('exercises');

        return new CategoryResource($category);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $request->user()
            ->categories()
            ->create($request->validated());

        $category->loadCount('exercises');

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $category->update($request->validated());
        $category->loadCount('exercises');

        return new CategoryResource($category);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);
        $category->delete();

        return response()->json([], 204);
    }
}
