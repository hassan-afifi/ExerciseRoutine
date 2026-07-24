<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->delete();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'birth_date' => '2000-01-01',
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name' => 'Hassan Ibrahim',
            'email' => 'hassan@example.com',
            'birth_date' => '2008-08-28',
            'is_admin' => false,
        ]);

        User::factory()->count(6)->create();
    }
}
