<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function __construct(
        protected OrganizationService $organizationService
    ) {}

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('view', $organization);

        return Inertia::render('Settings/Organization', [
            'organization' => $organization,
            'can' => [
                'update' => $request->user()->can('update', $organization),
                'delete' => $request->user()->can('delete', $organization),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('update', $organization);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|image|max:1024', // Max 1MB
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('organizations/logos', 'public');
            $data['logo_url'] = '/storage/' . $path;
        }

        $this->organizationService->updateOrganization($organization, $data);

        return back()->with('success', 'Organization updated successfully.');
    }

    /**
     * List organization members.
     */
    public function members(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('viewMembers', $organization);

        return Inertia::render('Settings/Members', [
            'organization' => $organization,
            'members' => $organization->users()->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->pivot->role,
                    'joined_at' => $user->pivot->joined_at,
                ];
            }),
            'can' => [
                'manage_members' => $request->user()->can('manageMembers', $organization),
            ],
        ]);
    }

    /**
     * Update a member's role.
     */
    public function updateMemberRole(Request $request, User $user)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('manageMembers', $organization);

        // Prevent modifying own role to avoid locking oneself out
        if ($user->id === $request->user()->id) {
            abort(403, 'You cannot change your own role.');
        }

        // Ensure user belongs to organization
        if (!$organization->users()->where('user_id', $user->id)->exists()) {
            abort(404, 'User not found in this organization.');
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,editor,viewer',
        ]);

        $this->organizationService->updateUserRole($organization, $user, $validated['role']);

        return back()->with('success', 'Member role updated successfully.');
    }

    /**
     * Remove a member from the organization.
     */
    public function removeMember(Request $request, User $user)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('manageMembers', $organization);

        if ($user->id === $request->user()->id) {
            abort(403, 'You cannot remove yourself.');
        }

        $this->organizationService->removeUser($organization, $user);

        return back()->with('success', 'Member removed successfully.');
    }
}
