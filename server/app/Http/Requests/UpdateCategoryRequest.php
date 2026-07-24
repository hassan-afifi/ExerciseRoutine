<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $category = $this->route('category');
        return $category instanceof Category && $category->user_id === Auth::id();
    }

    public function rules(): array
    {
        /** @var \App\Models\Category $category */
        $category = $this->route('category');

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                Rule::unique('categories', 'name')
                    ->where('user_id', Auth::id())
                    ->ignore($category->id),
            ],
        ];
    }
}
