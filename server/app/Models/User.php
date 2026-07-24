<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'birth_date',
        'password',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birth_date' => 'date',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function favouriteExercises()
    {
        return $this->belongsToMany(Exercise::class, 'favourite_exercise')
            ->withTimestamps();
    }
}
