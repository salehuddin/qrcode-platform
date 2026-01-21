<?php

namespace App\Services;

use App\Models\Invitation;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\TeamInvitation;

class InvitationService
{
    /**
     * Create and send an invitation.
     */
    public function createInvitation(Organization $organization, User $inviter, string $email, string $role = 'viewer'): Invitation
    {
        // Check if user is already a member
        $existingUser = User::where('email', $email)->first();
        if ($existingUser && $organization->users()->where('user_id', $existingUser->id)->exists()) {
            throw new \Exception("User is already a member of this organization.");
        }

        // Check for existing pending invitation
        $existingInvitation = Invitation::where('organization_id', $organization->id)
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->first();

        if ($existingInvitation) {
            return $existingInvitation;
        }

        $invitation = Invitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $inviter->id,
            'email' => $email,
            'role' => $role,
            'token' => Str::random(32),
            'expires_at' => now()->addDays(7),
        ]);

        // Send email
        Mail::to($email)->send(new TeamInvitation($invitation));

        return $invitation;
    }

    /**
     * Accept an invitation.
     */
    public function acceptInvitation(string $token, User $user): Organization
    {
        $invitation = Invitation::where('token', $token)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        if ($invitation->email !== $user->email) {
            throw new \Exception("This invitation was sent to a different email address.");
        }

        $organization = $invitation->organization;

        // Add user to organization
        if (!$organization->users()->where('user_id', $user->id)->exists()) {
            $organization->users()->attach($user->id, [
                'role' => $invitation->role,
                'joined_at' => now(),
            ]);
        }

        // Mark invitation as accepted
        $invitation->update(['accepted_at' => now()]);

        // Send welcome email
        $notificationService = app(\App\Services\NotificationService::class);
        $notificationService->sendWelcomeEmail($user);

        return $organization;
    }

    /**
     * Cancel/Delete an invitation.
     */
    public function cancelInvitation(Invitation $invitation): void
    {
        $invitation->delete();
    }
}
