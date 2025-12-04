<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'invited_by',
        'email',
        'role',
        'token',
        'expires_at',
        'accepted_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    /**
     * Get the organization for this invitation.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the user who sent this invitation.
     */
    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Check if the invitation has expired.
     */
    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the invitation has been accepted.
     */
    public function isAccepted()
    {
        return $this->accepted_at !== null;
    }
}
