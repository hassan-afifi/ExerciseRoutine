<?php

namespace Database\Factories;

use App\Models\Exercise;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Exercise>
 */
class ExerciseFactory extends Factory
{
    protected $model = Exercise::class;

    public function definition(): array
    {
        $muscles = ['Back', 'Biceps', 'Cardio', 'Chest', 'Core', 'Forearms', 'Full Body', 'Legs', 'Neck', 'Shoulders', 'Triceps'];
        $equipment = ['Barbell', 'Body Weight', 'Bosu Ball', 'Cable', 'Dumbbell', 'Hammer', 'Kettlebell', 'Leverage Machine', 'Medicine Ball', 'Resistance Band', 'Roll', 'Rope', 'Sled Machine', 'Smith Machine', 'Stability Ball', 'Suspension', 'Trap Bar', 'Wheel Roller'];

        return [
            'title' => fake()->unique()->words(fake()->numberBetween(1, 3), true),
            'description' => fake()->sentence(14),
            'instructions' => fake()->paragraphs(3, true),
            'difficulty' => fake()->randomElement(['easy', 'medium', 'hard']),
            'muscle' => fake()->randomElement($muscles),
            'equipment' => fake()->randomElement($equipment),
            'image_path' => 'Image.jpeg',
        ];
    }
}
