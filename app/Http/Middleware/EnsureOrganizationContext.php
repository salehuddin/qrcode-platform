<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Check if organization is already set in session
        if (!$request->session()->has('organization_id')) {
            // Try to get the first organization for the user
            $organization = $user->organizations()->first();

            if ($organization) {
                $request->session()->put('organization_id', $organization->id);
            } else {
                // If no organization, and creating one is allowed (SaaS), redirect there
                // For internal, this shouldn't happen due to seeding, but handle gracefully
                if (config('features.features.organization_creation')) {
                    return redirect()->route('organizations.create');
                }
                
                abort(403, 'No organization found.');
            }
        }

        // Share organization with views/controllers via request
        // We can also bind it to the container if needed
        
        return $next($request);
    }
}
