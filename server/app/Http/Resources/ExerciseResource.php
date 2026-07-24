<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'instructions' => $this->instructions,
            'difficulty' => $this->difficulty,
            'muscle' => $this->muscle,
            'equipment' => $this->equipment,
            'image_path' => $this->image_path,
            'image_url' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'owner' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'is_favourite' => (bool) ($this->is_favourite ?? false),
            'favourites_count' => $this->whenCounted('favouritedByUsers'),
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),
            'deleted_at' => $this->deleted_at?->toAtomString(),
        ];
    }
}
