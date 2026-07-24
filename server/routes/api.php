<?php

use App\Http\Controllers\Api\Admin\CategoryManagementController as AdminCategoryManagementController;
use App\Http\Controllers\Api\Admin\ExerciseManagementController as AdminExerciseManagementController;
use App\Http\Controllers\Api\Admin\UserManagementController as AdminUserManagementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\FavouriteController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/exercises', [ExerciseController::class, 'index']);
Route::get('/exercises/{exercise}', [ExerciseController::class, 'show'])
    ->whereNumber('exercise');
Route::get('/categories/public', [CategoryController::class, 'publicIndex']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [ExerciseController::class, 'dashboard']);
    Route::get('/exercises/my', [ExerciseController::class, 'myExercises']);
    Route::post('/exercises', [ExerciseController::class, 'store']);
    Route::patch('/exercises/{exercise}', [ExerciseController::class, 'update'])
        ->whereNumber('exercise');
    Route::delete('/exercises/{exercise}', [ExerciseController::class, 'destroy'])
        ->whereNumber('exercise');

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show'])
        ->whereNumber('category');
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])
        ->whereNumber('category');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->whereNumber('category');

    Route::get('/favourites', [FavouriteController::class, 'index']);
    Route::post('/exercises/{exercise}/favourite', [FavouriteController::class, 'store'])
        ->whereNumber('exercise');
    Route::delete('/exercises/{exercise}/favourite', [FavouriteController::class, 'destroy'])
        ->whereNumber('exercise');
});

Route::middleware(['auth:sanctum', 'can:manage-users'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminUserManagementController::class, 'index']);
    Route::get('/users/{user}', [AdminUserManagementController::class, 'show'])
        ->whereNumber('user');
    Route::patch('/users/{user}', [AdminUserManagementController::class, 'update'])
        ->whereNumber('user');
    Route::delete('/users/{user}', [AdminUserManagementController::class, 'destroy'])
        ->whereNumber('user');

    Route::get('/exercises', [AdminExerciseManagementController::class, 'index']);
    Route::get('/exercises/{exercise}', [AdminExerciseManagementController::class, 'show'])
        ->whereNumber('exercise');
    Route::patch('/exercises/{exercise}', [AdminExerciseManagementController::class, 'update'])
        ->whereNumber('exercise');
    Route::delete('/exercises/{exercise}', [AdminExerciseManagementController::class, 'destroy'])
        ->whereNumber('exercise');

    Route::get('/categories', [AdminCategoryManagementController::class, 'index']);
    Route::get('/categories/{category}', [AdminCategoryManagementController::class, 'show'])
        ->whereNumber('category');
    Route::patch('/categories/{category}', [AdminCategoryManagementController::class, 'update'])
        ->whereNumber('category');
    Route::delete('/categories/{category}', [AdminCategoryManagementController::class, 'destroy'])
        ->whereNumber('category');
});
