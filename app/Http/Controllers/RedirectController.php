<?php

namespace App\Http\Controllers;

use App\Models\QRCode;
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
        $qrCode = QRCode::where('permalink', $permalink)
            ->where('is_active', true)
            ->firstOrFail();

        // Track the scan
        $this->trackScan($request, $qrCode);

        // Increment counters
        $qrCode->increment('scan_count');
        $qrCode->update(['last_scanned_at' => now()]);

        $destination = $qrCode->destination_url;
        
        // Handle vCard data (Contact QR) - Download as .vcf file
        if (str_starts_with($destination, 'BEGIN:VCARD')) {
            return response($destination, 200, [
                'Content-Type' => 'text/vcard; charset=utf-8',
                'Content-Disposition' => 'attachment; filename="contact.vcf"'
            ]);
        }
        
        // Handle iCalendar data (Event QR) - Download as .ics file
        if (str_starts_with($destination, 'BEGIN:VCALENDAR')) {
            return response($destination, 200, [
                'Content-Type' => 'text/calendar; charset=utf-8',
                'Content-Disposition' => 'attachment; filename="event.ics"'
            ]);
        }
        
        // Handle HTTP/HTTPS URLs (URL QR) - Normal redirect
        if (filter_var($destination, FILTER_VALIDATE_URL) && 
            preg_match('/^https?:\/\//', $destination)) {
            return redirect($destination);
        }
        
        // Handle all other URI schemes (Phone, Email, Location, SMS, WiFi QRs)
        // Use meta refresh for tel:, mailto:, geo:, SMSTO:, WIFI:
        return response()->view('redirect-meta', [
            'destination' => $destination,
            'qrName' => $qrCode->name
        ]);
    }

    /**
     * Track scan event with device and location data.
     */
    protected function trackScan(Request $request, QRCode $qrCode): void
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
