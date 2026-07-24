<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryManagementController extends Controller
{
    public function show(Category $category): CategoryResource
    {
        $category->load(['user:id,name']);
        $category->loadCount('exercises');

        return new CategoryResource($category);
    }

    public function index(Request $request)
    {
        $perPage = max(1, min(50, $request->integer('per_page', 12)));
        $categories = Category::query()
            ->with('user:id,name')
            ->withCount('exercises')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return CategoryResource::collection($categories);
    }

    public function update(Request $request, Category $category): CategoryResource
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                Rule::unique('categories', 'name')
                    ->where('user_id', $category->user_id)
                    ->ignore($category->id),
            ],
        ]);

        $category->update($validated);
        $category->loadCount('exercises');

        return new CategoryResource($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([], 204);
    }
}
