<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TeamMemberController extends Controller
{
    /**
     * Add a member to the organization (Invite).
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization) {
            return back()->with('error', 'Organization not found.');
        }

        if (!$user->canManageQrCodes($organization)) {
            return back()->with('error', 'Unauthorized.');
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'role' => ['required', Rule::in(['admin', 'editor', 'viewer'])],
            'team_id' => 'nullable|string', // 'no-team' or ID
        ]);

        // Check if user exists
        $invitedUser = User::where('email', $validated['email'])->first();

        if (!$invitedUser) {
            // For MVP, we only support adding existing users.
            // In a real app, we would send an email invitation.
            return back()->with('error', 'User not found. For this demo, please invite an existing user.');
        }

        // Check if user is already in the organization
        if ($organization->users()->where('user_id', $invitedUser->id)->exists()) {
            return back()->with('error', 'User is already a member of this organization.');
        }

        // Attach user to organization
        $organization->users()->attach($invitedUser->id, [
            'role' => $validated['role'],
            'joined_at' => now(),
        ]);

        // If team is selected, add to team
        if (!empty($validated['team_id']) && $validated['team_id'] !== 'no-team') {
            $team = $organization->teams()->find($validated['team_id']);
            if ($team) {
                $team->users()->attach($invitedUser->id);
            }
        }

        return back()->with('success', 'Member added successfully.');
    }

    /**
     * Update member role.
     */
    public function update(Request $request, $userId)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization) {
            return back()->with('error', 'Organization not found.');
        }

        // Check permissions
        if (!$user->canManageQrCodes($organization)) {
            abort(403, 'Unauthorized action.');
        }

        $targetUser = User::findOrFail($userId);

        // Prevent modifying own role
        if ($targetUser->id === $user->id) {
            return back()->with('error', 'You cannot change your own role.');
        }

        // Ensure user belongs to organization
        if (!$organization->users()->where('user_id', $targetUser->id)->exists()) {
            return back()->with('error', 'User not found in this organization.');
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'editor', 'viewer'])],
        ]);

        $organization->users()->updateExistingPivot($targetUser->id, [
            'role' => $validated['role'],
        ]);

        return back()->with('success', 'Member role updated successfully.');
    }

    /**
     * Remove member from organization.
     */
    public function destroy($userId)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization) {
            return back()->with('error', 'Organization not found.');
        }

        // Check permissions
        if (!$user->canManageQrCodes($organization)) {
            abort(403, 'Unauthorized action.');
        }

        $targetUser = User::findOrFail($userId);

        if ($targetUser->id === $user->id) {
            return back()->with('error', 'You cannot remove yourself.');
        }

        $organization->users()->detach($targetUser->id);

        return back()->with('success', 'Member removed successfully.');
    }
}
