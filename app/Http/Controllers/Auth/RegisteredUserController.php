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
        } elseif (config('features.edition') === 'internal') {
            // Internal Mode Fallback (First User/Setup)
            $organization = Organization::first();
            $role = 'admin';

            if (!$organization) {
                // First user becomes the Owner of the default organization
                $organization = Organization::create([
                    'name' => 'My Organization',
                    'slug' => 'my-organization',
                    'is_active' => true,
                ]);
                $role = 'owner';
            }

            // Attach user to the organization
            if (!$organization->users()->where('user_id', $user->id)->exists()) {
                $organization->users()->attach($user->id, [
                    'role' => $role,
                    'joined_at' => now(),
                ]);
            }
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
