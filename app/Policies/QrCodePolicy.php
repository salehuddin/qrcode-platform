<?php

namespace App\Policies;

use App\Models\QRCode;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class QrCodePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Filtered by controller based on org context
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, QRCode $qrCode): bool
    {
        return $user->organizations->contains($qrCode->organization_id);
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
    public function update(User $user, QRCode $qrCode): bool
    {
        $org = $qrCode->organization;
        if (!$org) return false; // Should not happen for org-owned QRs

        // Check if user belongs to the org
        if (!$user->organizations->contains($org->id)) return false;

        return $user->canManageQrCodes($org);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, QRCode $qrCode): bool
    {
        return $this->update($user, $qrCode);
    }
}
