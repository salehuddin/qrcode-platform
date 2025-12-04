<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FolderPolicy
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
    public function view(User $user, Folder $folder): bool
    {
        return $user->organizations->contains($folder->organization_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        $org = $user->currentOrganization();
        if (!$org) return false;

        return $user->canManageQrCodes($org); // Reusing QR code permission for folders
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Folder $folder): bool
    {
        return $this->view($user, $folder) && $this->create($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Folder $folder): bool
    {
        return $this->update($user, $folder);
    }
}
