<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;

class RedirectController extends Controller
{
    /**
     * Handle QR code permalink redirection and track the scan.
     */
    public function redirect(Request $request, string $permalink)
    {
        // Find the QR code by permalink
        $qrCode = QrCode::where('permalink', $permalink)
            ->where('is_active', true)
            ->firstOrFail();

        // Track the scan
        $this->trackScan($request, $qrCode);

        // Increment counters
        $qrCode->increment('scan_count');
        $qrCode->update(['last_scanned_at' => now()]);

        // Redirect to destination URL
        return redirect($qrCode->destination_url);
    }

    /**
     * Track scan event with device and location data.
     */
    protected function trackScan(Request $request, QrCode $qrCode): void
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        // Determine device type
        $deviceType = 'Desktop';
        if ($agent->isMobile()) {
            $deviceType = 'Mobile';
        } elseif ($agent->isTablet()) {
            $deviceType = 'Tablet';
        }

        // Create scan record
        QrScan::create([
            'qr_code_id' => $qrCode->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_type' => $deviceType,
            'browser' => $agent->browser(),
            'os' => $agent->platform(),
            'country' => null, // Can be enhanced with geolocation service
            'city' => null,    // Can be enhanced with geolocation service
            'referrer' => $request->header('referer'),
            'scanned_at' => now(),
        ]);
    }
}
