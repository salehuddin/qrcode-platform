<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all QR codes created by this user.
     */
    public function qrCodes()
    {
        return $this->hasMany(QrCode::class);
    }

    /**
     * Get all organizations this user belongs to.
     */
    public function organizations()
    {
        return $this->belongsToMany(Organization::class)
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get all teams this user belongs to.
     */
    public function teams()
    {
        return $this->belongsToMany(Team::class)->withTimestamps();
    }

    /**
     * Get the current organization (from session or first).
     */
    public function currentOrganization()
    {
        // TODO: Get from session
        return $this->organizations()->first();
    }

    /**
     * Check if user has a specific role in an organization.
     */
    public function hasRole(Organization $org, string $role)
    {
        return $this->organizations()
            ->wherePivot('organization_id', $org->id)
            ->wherePivot('role', $role)
            ->exists();
    }

    /**
     * Check if user can manage QR codes in an organization.
     */
    public function canManageQrCodes(Organization $org)
    {
        $role = $this->organizations()
            ->wherePivot('organization_id', $org->id)
            ->first()?->pivot->role;

        return in_array($role, ['owner', 'admin', 'editor']);
    }
}
