<?php

namespace App\Policies;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TagPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Tag $tag): bool
    {
        return $user->organizations->contains($tag->organization_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        $org = $user->currentOrganization();
        if (!$org) return false;

        return $user->canManageQrCodes($org);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Tag $tag): bool
    {
        return $this->view($user, $tag) && $this->create($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Tag $tag): bool
    {
        return $this->update($user, $tag);
    }
}
