<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
    ];

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
