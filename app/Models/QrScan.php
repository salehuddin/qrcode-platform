<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrScan extends Model
{
    use HasFactory;

    protected $fillable = [
        'qr_code_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'os',
        'country',
        'city',
        'referrer',
        'scanned_at',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    /**
     * Get the QR code that owns this scan.
     */
    public function qrCode(): BelongsTo
    {
        return $this->belongsTo(QrCode::class, 'qr_code_id');
    }
}
