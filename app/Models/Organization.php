<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo_url',
        'website',
        'email',
        'phone',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get all users in this organization.
     */
    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get the owner of this organization.
     */
    public function owner()
    {
        return $this->users()->wherePivot('role', 'owner')->first();
    }

    /**
     * Get all teams in this organization.
     */
    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    /**
     * Get all folders in this organization.
     */
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    /**
     * Get all tags in this organization.
     */
    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    /**
     * Get all QR codes in this organization.
     */
    public function qrCodes()
    {
        return $this->hasMany(QRCode::class);
    }

    /**
     * Get all invitations for this organization.
     */
    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }
}
