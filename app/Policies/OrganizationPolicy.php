<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrganizationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Organization $organization): bool
    {
        return $user->hasRole($organization, 'viewer') ||
               $user->hasRole($organization, 'editor') ||
               $user->hasRole($organization, 'admin') ||
               $user->hasRole($organization, 'owner');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Organization $organization): bool
    {
        return $user->hasRole($organization, 'admin') ||
               $user->hasRole($organization, 'owner');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Organization $organization): bool
    {
        return $user->hasRole($organization, 'owner');
    }

    /**
     * Determine whether the user can view members.
     */
    public function viewMembers(User $user, Organization $organization): bool
    {
        return $this->view($user, $organization);
    }

    /**
     * Determine whether the user can manage members.
     */
    public function manageMembers(User $user, Organization $organization): bool
    {
        return $user->hasRole($organization, 'admin') ||
               $user->hasRole($organization, 'owner');
    }
}
