<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'thumbnail',
        'config',
        'category',
        'is_public',
    ];

    protected $casts = [
        'config' => 'array',
        'is_public' => 'boolean',
    ];
}
