<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Organization;

class CheckOrganizationRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        $orgId = $request->session()->get('organization_id');

        if (!$user || !$orgId) {
            abort(403, 'Unauthorized action.');
        }

        $organization = Organization::find($orgId);

        if (!$organization) {
            abort(404, 'Organization not found.');
        }

        // Check role hierarchy
        // owner > admin > editor > viewer
        $roles = ['owner', 'admin', 'editor', 'viewer'];
        $userRole = $user->organizations()
            ->where('organization_id', $orgId)
            ->first()
            ?->pivot
            ?->role;

        if (!$userRole) {
            abort(403, 'User is not a member of this organization.');
        }

        if (!$this->hasSufficientRole($userRole, $role)) {
            abort(403, 'Insufficient permissions.');
        }

        return $next($request);
    }

    /**
     * Check if user role is sufficient for required role.
     */
    protected function hasSufficientRole(string $userRole, string $requiredRole): bool
    {
        $hierarchy = [
            'owner' => 4,
            'admin' => 3,
            'editor' => 2,
            'viewer' => 1,
        ];

        return ($hierarchy[$userRole] ?? 0) >= ($hierarchy[$requiredRole] ?? 0);
    }
}
