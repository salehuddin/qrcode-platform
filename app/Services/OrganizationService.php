<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
        $organization->users()->detach($user->id);
    }

    /**
     * Update a user's role in an organization.
     */
    public function updateUserRole(Organization $organization, User $user, string $role): void
    {
        $organization->users()->updateExistingPivot($user->id, ['role' => $role]);
    }
}
