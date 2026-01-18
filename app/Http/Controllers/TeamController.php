<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display the team management dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization) {
            return redirect()->route('dashboard')->with('error', 'You do not belong to any organization.');
        }

        // Ensure user has permission to view team settings
        // For MVP, allow all members to view, but maybe restrict actions
        
        $members = $organization->users()
            ->withCount(['qrCodes' => function ($query) use ($organization) {
                $query->where('organization_id', $organization->id);
            }])
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'profile_photo_url' => $member->profile_photo_url,
                    'qr_codes_count' => $member->qr_codes_count,
                    'pivot' => [
                        'role' => $member->pivot->role,
                        'joined_at' => $member->pivot->joined_at,
                    ],
                ];
            });

        $teams = $organization->teams()
            ->withCount('users')
            ->get();

        return Inertia::render('Team/Index', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
            ],
            'members' => $members,
            'teams' => $teams,
        ]);
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization) {
            return back()->with('error', 'Organization not found.');
        }

        // Check permissions (e.g., only admin/owner can create teams)
        if (!$user->canManageQrCodes($organization)) {
             return back()->with('error', 'Unauthorized.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $organization->teams()->create($validated);

        return back()->with('success', 'Team created successfully.');
    }

    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, Team $team)
    {
        // TODO: Implement update logic
    }

    /**
     * Remove the specified team from storage.
     */
    public function destroy(Team $team)
    {
        // TODO: Implement destroy logic
    }

    /**
     * Display the specified user's details and activity.
     */
    public function show(Request $request, $userId)
    {
        $organization = $request->user()->currentOrganization();
        
        // Find user but ensure they are in the organization
        $user = $organization->users()->where('users.id', $userId)->firstOrFail();

        // Get QR codes created by this user in this organization
        $qrCodes = $organization->qrCodes()
            ->where('user_id', $user->id)
            ->with('tags')
            ->latest()
            ->get();        
        
        $activities = \Spatie\Activitylog\Models\Activity::where('causer_id', $user->id)
            ->latest()
            ->limit(50)
            ->get();

        return Inertia::render('Team/Show', [
            'member' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo_url' => $user->profile_photo_url,
                'pivot' => $user->pivot,
            ],
            'qr_codes' => $qrCodes,
            'activities' => $activities,
        ]);
    }
}
