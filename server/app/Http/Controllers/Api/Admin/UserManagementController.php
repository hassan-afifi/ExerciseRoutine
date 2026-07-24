<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function show(User $user): UserResource
    {
        $user->loadCount(['exercises', 'categories', 'favouriteExercises']);

        return new UserResource($user);
    }

    public function index(Request $request)
    {
        $perPage = max(1, min(50, $request->integer('per_page', 12)));
        $users = User::query()
            ->withCount(['exercises', 'categories', 'favouriteExercises'])
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return UserResource::collection($users);
    }

    public function update(Request $request, User $user): UserResource
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'is_admin' => ['required', 'boolean'],
        ]);

        $user->update($validated);

        return new UserResource($user);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        abort_if($request->user()->id === $user->id, 422, 'You cannot delete your own account.');
        $user->delete();

        return response()->json([], 204);
    }
}
