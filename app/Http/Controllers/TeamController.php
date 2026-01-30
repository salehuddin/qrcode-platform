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

        // Ensure organization_id is in session for middleware
        session(['organization_id' => $organization->id]);

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

        // Check permissions - only admin and owner can create teams
        $role = $organization->users()->where('user_id', $user->id)->first()?->pivot->role;
        if (!in_array($role, ['owner', 'admin'])) {
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
     * Display team detail page with members and QR codes.
     */
    public function showTeam(Request $request, Team $team)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($team->organization_id !== $organization->id) {
            abort(403);
        }

        $members = $team->users()
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
                ];
            });

        $availableMembers = $organization->users()
            ->whereNotIn('users.id', $members->pluck('id'))
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                ];
            });

        $qrCodes = $organization->qrCodes()
            ->where('team_id', $team->id)
            ->with(['user', 'tags'])
            ->latest()
            ->get();

        return Inertia::render('Team/TeamDetail', [
            'team' => $team,
            'members' => $members,
            'availableMembers' => $availableMembers,
            'qrCodes' => $qrCodes,
        ]);
    }

    /**
     * Add a member to a team.
     */
    public function addMember(Request $request, Team $team)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($team->organization_id !== $organization->id) {
            abort(403);
        }

        $role = $organization->users()->where('user_id', $user->id)->first()?->pivot->role;
        if (!in_array($role, ['owner', 'admin'])) {
            return back()->with('error', 'Unauthorized.');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if (!$organization->users()->where('users.id', $validated['user_id'])->exists()) {
            return back()->with('error', 'User is not a member of this organization.');
        }

        $team->users()->syncWithoutDetaching([$validated['user_id']]);

        return back()->with('success', 'Member added to team successfully.');
    }

    /**
     * Remove a member from a team.
     */
    public function removeMember(Request $request, Team $team, User $user)
    {
        $currentUser = Auth::user();
        $organization = $currentUser->currentOrganization();

        if ($team->organization_id !== $organization->id) {
            abort(403);
        }

        $role = $organization->users()->where('user_id', $currentUser->id)->first()?->pivot->role;
        if (!in_array($role, ['owner', 'admin'])) {
            return back()->with('error', 'Unauthorized.');
        }

        $team->users()->detach($user->id);

        return back()->with('success', 'Member removed from team successfully.');
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
