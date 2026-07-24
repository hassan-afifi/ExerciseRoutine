<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{
    public function index(Request $request)
    {
        $perPage = max(1, min(50, $request->integer('per_page', 12)));
        $favourites = $request->user()
            ->favouriteExercises()
            ->with(['categories:id,name,user_id', 'user:id,name'])
            ->withCount('favouritedByUsers')
            ->orderByPivot('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $favourites->getCollection()->each(fn (Exercise $exercise) => $exercise->setAttribute('is_favourite', true));

        return ExerciseResource::collection($favourites);
    }

    public function store(Request $request, Exercise $exercise): JsonResponse
    {
        $request->user()->favouriteExercises()->syncWithoutDetaching([$exercise->id]);

        return response()->json([
            'message' => 'Exercise marked as favourite.',
        ], 201);
    }

    public function destroy(Request $request, Exercise $exercise): JsonResponse
    {
        $request->user()->favouriteExercises()->detach($exercise->id);

        return response()->json([], 204);
    }
}
