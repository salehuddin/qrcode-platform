<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'slug',
        'color',
    ];

    /**
     * Get the organization that owns this tag.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get all QR codes with this tag.
     */
    public function qrCodes()
    {
        return $this->belongsToMany(QrCode::class, 'qr_code_tag', 'tag_id', 'qr_code_id')->withTimestamps();
    }
}
