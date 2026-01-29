<?php

namespace App\Http\Controllers;

use App\Models\QrScan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with real statistics.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $organization = $user->currentOrganization();

        if (!$organization) {
            return Inertia::render('Dashboard', [
                'stats' => [
                    'total_qr_codes' => 0,
                    'active_qr_codes' => 0,
                    'total_scans' => 0,
                    'scans_this_month' => 0,
                    'top_performing_codes' => [],
                ]
            ]);
        }

        // Get QR code IDs for this organization
        $qrCodeIds = $organization->qrCodes()->pluck('id');

        // Calculate real statistics
        $stats = [
            'total_qr_codes' => $organization->qrCodes()->count(),
            'active_qr_codes' => $organization->qrCodes()->where('is_active', true)->count(),
            'total_scans' => QrScan::whereIn('qr_code_id', $qrCodeIds)->count(),
            'scans_this_month' => QrScan::whereIn('qr_code_id', $qrCodeIds)
                ->whereMonth('scanned_at', now()->month)
                ->whereYear('scanned_at', now()->year)
                ->count(),
            'top_performing_codes' => $organization->qrCodes()
                ->withCount('scans')
                ->orderBy('scans_count', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($qr) => [
                    'id' => $qr->id,
                    'name' => $qr->name,
                    'type' => $qr->type,
                    'scan_count' => $qr->scans_count,
                ])
                ->toArray(),
        ];

        return Inertia::render('Dashboard', ['stats' => $stats]);
    }
}
