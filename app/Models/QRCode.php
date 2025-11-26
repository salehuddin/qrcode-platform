<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QRCode extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'content',
        'destination_url',
        'is_active',
        'scan_count',
        'unique_scans',
        'last_scanned_at',
        'design',
        'customization',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'scan_count' => 'integer',
            'unique_scans' => 'integer',
            'last_scanned_at' => 'datetime',
            'design' => 'array',
            'customization' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
