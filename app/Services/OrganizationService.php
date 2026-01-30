<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\User;
use App\Notifications\MemberRemovedNotification;
use App\Notifications\MemberRemovedAdminNotification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrganizationService
{
    /**
     * Create a new organization.
     */
    public function createOrganization(User $owner, array $data): Organization
    {
        return DB::transaction(function () use ($owner, $data) {
            $organization = Organization::create([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'description' => $data['description'] ?? null,
                'logo_url' => $data['logo_url'] ?? null,
                'website' => $data['website'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'settings' => $data['settings'] ?? [],
                'is_active' => true,
            ]);

            // Attach owner
            $organization->users()->attach($owner->id, ['role' => 'owner']);

            return $organization;
        });
    }

    /**
     * Update an existing organization.
     */
    public function updateOrganization(Organization $organization, array $data): Organization
    {
        $organization->update($data);
        return $organization->refresh();
    }

    /**
     * Get the default organization (for internal edition).
     */
    public function getDefaultOrganization(): Organization
    {
        return Organization::firstOrCreate(
            ['slug' => 'default-organization'],
            [
                'name' => 'Default Organization',
                'is_active' => true,
            ]
        );
    }

    /**
     * Add a user to an organization.
     */
    public function addUser(Organization $organization, User $user, string $role = 'viewer'): void
    {
        if (!$organization->users()->where('user_id', $user->id)->exists()) {
            $organization->users()->attach($user->id, ['role' => $role]);
        }
    }

    /**
     * Remove a user from an organization.
     */
    public function removeUser(Organization $organization, User $user): void
    {
        DB::transaction(function () use ($organization, $user) {
            // 1. Transfer user's QR codes to organization owner
            $owner = $organization->users()->wherePivot('role', 'owner')->first();
            
            if ($owner && $owner->id !== $user->id) {
                // Transfer all QR codes from removed user to owner
                DB::table('qr_codes')
                    ->where('organization_id', $organization->id)
                    ->where('user_id', $user->id)
                    ->update(['user_id' => $owner->id]);
            }
            
            // 2. Remove user from organization
            $organization->users()->detach($user->id);
            
            // 3. Send notifications
            $removedBy = Auth::user();
            
            // Notify removed user
            $user->notify(new MemberRemovedNotification($organization, $removedBy));
            
            // Notify owner/admin
            if ($owner) {
                $owner->notify(new MemberRemovedAdminNotification($organization, $user, $removedBy));
            }
        });
    }

    /**
     * Update a user's role in an organization.
     */
    public function updateUserRole(Organization $organization, User $user, string $role): void
    {
        $organization->users()->updateExistingPivot($user->id, ['role' => $role]);
    }
}
