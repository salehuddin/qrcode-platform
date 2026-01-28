<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Services\InvitationService;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        protected InvitationService $invitationService
    ) {}

    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        // Internal Mode: Registration is Invite-Only
        // Exception: Allow registration if no organization exists (First User Setup)
        if (config('features.edition') === 'internal' && !$request->has('token') && Organization::count() > 0) {
            abort(403, 'Registration is by invitation only.');
        }

        return Inertia::render('Auth/Register', [
            'token' => $request->token,
            'email' => $request->email,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        if ($request->has('token')) {
            try {
                $organization = $this->invitationService->acceptInvitation($request->token, $user);
                $request->session()->put('organization_id', $organization->id);
            } catch (\Exception $e) {
                // Log error but allow login? Or fail? 
                // Currently ensuring user is at least created.
            }
        } else {
            // General Registration (No Invite Token)
            // Automatically create a personal organization for the new user
            
            $orgName = $user->name . "'s Team";
            $slug = \Illuminate\Support\Str::slug($orgName);
            
            // Ensure unique slug
            $count = Organization::where('slug', 'like', "{$slug}%")->count();
            if ($count > 0) {
                $slug .= '-' . ($count + 1);
            }

            $organization = Organization::create([
                'name' => $orgName,
                'slug' => $slug,
                'is_active' => true,
            ]);

            // Attach user as Owner
            $organization->users()->attach($user->id, [
                'role' => 'owner',
                'joined_at' => now(),
            ]);
            
            // Set session immediately so middleware passes
            $request->session()->put('organization_id', $organization->id);
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
