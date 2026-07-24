<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::query()->delete();

        $users = User::query()->orderBy('id')->get();
        if ($users->isEmpty()) {
            return;
        }

        $admin = $users->firstWhere('email', 'admin@example.com');
        $hassan = $users->firstWhere('email', 'hassan@example.com');
        $priorityUsers = collect([$hassan, $admin])
            ->filter()
            ->unique('id')
            ->values();

        if ($priorityUsers->isEmpty()) {
            $priorityUsers = $users->take(1)->values();
        }

        // Requested distribution: admin = 2, Hassan = 2, total categories = 8.
        foreach ($priorityUsers as $user) {
            $user->categories()->saveMany(Category::factory()->count(2)->make());
        }

        $targetTotalCategories = 8;
        $remaining = max(0, $targetTotalCategories - ($priorityUsers->count() * 2));
        $others = $users->whereNotIn('id', $priorityUsers->pluck('id')->all())->values();

        foreach ($others as $index => $user) {
            if ($remaining <= 0) {
                break;
            }

            $usersLeft = $others->count() - $index;
            $countForUser = intdiv($remaining, max(1, $usersLeft));
            $countForUser = max(1, $countForUser);

            $user->categories()->saveMany(Category::factory()->count($countForUser)->make());
            $remaining -= $countForUser;
        }
    }
}
