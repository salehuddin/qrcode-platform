<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
    ];

    /**
     * Get the organization that owns this team.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get all users in this team.
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    /**
     * Get all QR codes assigned to this team.
     */
    public function qrCodes()
    {
        return $this->hasMany(QRCode::class);
    }
}
