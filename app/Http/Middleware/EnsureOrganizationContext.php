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

        // Check if user belongs to any organization
        if ($user->organizations->count() === 0) {
            // Allow access to no-organization page and logout
            if ($request->routeIs('no-organization') || $request->routeIs('logout')) {
                return $next($request);
            }
            
            return redirect()->route('no-organization');
        }

        // Get current organization from session
        $currentOrgId = $request->session()->get('organization_id');

        // If no session org or user doesn't belong to it anymore, use first org
        if (!$currentOrgId || !$user->organizations->contains($currentOrgId)) {
            $firstOrg = $user->organizations->first();
            $request->session()->put('organization_id', $firstOrg->id);
        }

        return $next($request);
    }
}
