<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'ExerciseRoutine API',
        'status' => 'ok',
        'docs' => '/api',
    ]);
});