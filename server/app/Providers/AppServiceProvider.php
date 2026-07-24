<?php

namespace App\Providers;

use App\Models\Exercise;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        Gate::define('manage-users', function (User $user) {
            return $user->is_admin;
        });

        Gate::define('access-exercise', function (User $user, Exercise $exercise) {
            return $user->id === $exercise->user_id;
        });
    }
}
