<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ExerciseFormRequest extends FormRequest
{
    private const MUSCLE_OPTIONS = [
        'Back',
        'Biceps',
        'Cardio',
        'Chest',
        'Core',
        'Forearms',
        'Full Body',
        'Legs',
        'Neck',
        'Shoulders',
        'Triceps',
    ];

    private const EQUIPMENT_OPTIONS = [
        'Barbell',
        'Body Weight',
        'Bosu Ball',
        'Cable',
        'Dumbbell',
        'Hammer',
        'Kettlebell',
        'Leverage Machine',
        'Medicine Ball',
        'Resistance Band',
        'Roll',
        'Rope',
        'Sled Machine',
        'Smith Machine',
        'Stability Ball',
        'Suspension',
        'Trap Bar',
        'Wheel Roller',
    ];

    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'instructions' => ['required', 'string', 'min:10'],
            'difficulty' => ['required', Rule::in(['easy', 'medium', 'hard'])],
            'muscle' => ['required', Rule::in(self::MUSCLE_OPTIONS)],
            'equipment' => ['required', Rule::in(self::EQUIPMENT_OPTIONS)],
            'image' => ['nullable', 'image', 'max:2048'],
            'categories' => ['nullable', 'array'],
            'categories.*' => [
                'integer',
                Rule::exists('categories', 'id'),
            ],
        ];
    }
}
