<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandKit extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'config',
        'is_default',
    ];

    protected $casts = [
        'config' => 'array',
        'is_default' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
