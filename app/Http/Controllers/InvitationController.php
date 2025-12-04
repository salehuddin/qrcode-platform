<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Organization;
use App\Services\InvitationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function __construct(
        protected InvitationService $invitationService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('manageMembers', $organization);

        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'role' => 'required|in:admin,editor,viewer',
        ]);

        try {
            $this->invitationService->createInvitation(
                $organization,
                $request->user(),
                $validated['email'],
                $validated['role']
            );
            return back()->with('success', 'Invitation sent successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invitation $invitation)
    {
        $organization = $invitation->organization;
        
        // Ensure invitation belongs to current organization context
        if ($organization->id !== session('organization_id')) {
            abort(404);
        }

        Gate::authorize('manageMembers', $organization);

        $this->invitationService->cancelInvitation($invitation);

        return back()->with('success', 'Invitation cancelled successfully.');
    }

    /**
     * Accept an invitation.
     */
    public function accept(Request $request, $token)
    {
        try {
            $organization = $this->invitationService->acceptInvitation($token, $request->user());
            
            // Switch to the new organization
            $request->session()->put('organization_id', $organization->id);
            
            return redirect()->route('dashboard')->with('success', 'You have joined ' . $organization->name);
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Invalid or expired invitation.');
        }
    }
}
