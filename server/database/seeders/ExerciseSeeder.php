<?php

namespace Database\Seeders;

use App\Models\Exercise;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('favourite_exercise')->truncate();
        DB::table('category_exercise')->truncate();
        DB::table('exercises')->truncate();

        $allCategoryIds = DB::table('categories')->pluck('id');
        $users = User::query()->with('categories')->orderBy('id')->get();
        $admin = $users->firstWhere('email', 'admin@example.com');
        $hassan = $users->firstWhere('email', 'hassan@example.com');
        $priorityUsers = collect([$hassan, $admin])
            ->filter()
            ->unique('id')
            ->values();

        if ($users->isEmpty()) {
            return;
        }

        if ($priorityUsers->isEmpty()) {
            $priorityUsers = $users->take(1)->values();
        }

        // Ensure primary users (Hassan + Admin when present) each get 8.
        foreach ($priorityUsers as $user) {
            $this->seedExercisesForUser($user, 8, $allCategoryIds);
        }

        $targetTotalExercises = 28;
        $remaining = max(0, $targetTotalExercises - ($priorityUsers->count() * 8));
        $others = $users->whereNotIn('id', $priorityUsers->pluck('id')->all())->values();

        foreach ($others as $index => $user) {
            if ($remaining <= 0) {
                break;
            }

            $usersLeft = $others->count() - $index;
            $countForUser = intdiv($remaining, max(1, $usersLeft));
            $countForUser = max(1, $countForUser);

            $this->seedExercisesForUser($user, $countForUser, $allCategoryIds);
            $remaining -= $countForUser;
        }

        foreach ($priorityUsers as $user) {
            $this->seedUserFavourites($user);
        }

        $others->each(function (User $user) {
            $this->seedSingleFavouriteForUser($user);
        });
    }

    private function seedExercisesForUser(User $user, int $count, \Illuminate\Support\Collection $allCategoryIds): void
    {
        $createdExercises = $user->exercises()->saveMany(
            \App\Models\Exercise::factory()
                ->count($count)
                ->make()
        );

        $createdExercises->each(function (\App\Models\Exercise $exercise) use ($allCategoryIds) {
            if ($allCategoryIds->isNotEmpty()) {
                $exercise->categories()->sync(
                    $allCategoryIds->random(rand(1, min(2, $allCategoryIds->count())))->values()->all()
                );
            }
        });
    }

    private function seedUserFavourites(User $user): void
    {
        $ownExerciseId = Exercise::query()
            ->where('user_id', $user->id)
            ->inRandomOrder()
            ->value('id');

        $otherExerciseId = Exercise::query()
            ->where('user_id', '!=', $user->id)
            ->inRandomOrder()
            ->value('id');

        $favouriteIds = array_values(array_filter([$ownExerciseId, $otherExerciseId]));

        $user->favouriteExercises()->sync($favouriteIds);
    }

    private function seedSingleFavouriteForUser(User $user): void
    {
        $favouriteId = Exercise::query()
            ->where('user_id', '!=', $user->id)
            ->inRandomOrder()
            ->value('id');

        if (! $favouriteId) {
            $favouriteId = Exercise::query()
                ->inRandomOrder()
                ->value('id');
        }

        $user->favouriteExercises()->sync(
            $favouriteId ? [$favouriteId] : []
        );
    }
}
