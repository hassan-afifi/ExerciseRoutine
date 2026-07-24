<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'birth_date' => $this->birth_date?->toDateString(),
            'is_admin' => (bool) $this->is_admin,
            'exercises_count' => $this->whenCounted('exercises'),
            'categories_count' => $this->whenCounted('categories'),
            'favourite_exercises_count' => $this->whenCounted('favouriteExercises'),
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),
        ];
    }
}
