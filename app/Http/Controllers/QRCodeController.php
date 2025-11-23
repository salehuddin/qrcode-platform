<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QRCodeController extends Controller
{
    public function index()
    {
        return Inertia::render('QRCode/Index', [
            'qrcodes' => [
                [
                    'id' => '1',
                    'name' => 'Website Homepage',
                    'type' => 'url',
                    'content' => 'https://example.com',
                    'destination_url' => 'https://example.com',
                    'is_active' => true,
                    'scan_count' => 245,
                    'unique_scans' => 198,
                    'last_scanned_at' => '2024-11-23 14:30:00',
                    'created_at' => '2024-11-20 10:00:00',
                    'updated_at' => '2024-11-23 14:30:00',
                    'design' => [
                        'foreground_color' => '#000000',
                        'background_color' => '#FFFFFF',
                        'pattern' => 'square',
                        'error_correction' => 'M'
                    ],
                    'user_id' => 1
                ],
                [
                    'id' => '2',
                    'name' => 'WiFi Access',
                    'type' => 'wifi',
                    'content' => 'WIFI:S:MyNetwork;T:WPA;P:password;;',
                    'is_active' => true,
                    'scan_count' => 56,
                    'unique_scans' => 42,
                    'last_scanned_at' => '2024-11-22 18:15:00',
                    'created_at' => '2024-11-21 09:30:00',
                    'updated_at' => '2024-11-22 18:15:00',
                    'design' => [
                        'foreground_color' => '#000000',
                        'background_color' => '#FFFFFF',
                        'pattern' => 'dots',
                        'error_correction' => 'Q'
                    ],
                    'user_id' => 1
                ]
            ],
            'stats' => [
                'total_qr_codes' => 12,
                'active_qr_codes' => 10,
                'total_scans' => 1250,
                'scans_this_month' => 450,
                'top_performing_codes' => [],
                'recent_scans' => []
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('QRCode/Create');
    }

    public function store(Request $request)
    {
        // Store logic would go here
        return redirect()->route('qr-codes.index')->with('success', 'QR Code created successfully.');
    }

    public function show($id)
    {
        return Inertia::render('QRCode/Show', [
            'qrcode' => [
                'id' => $id,
                'name' => 'Website Homepage',
                'type' => 'url',
                'content' => 'https://example.com',
                'destination_url' => 'https://example.com',
                'is_active' => true,
                'scan_count' => 245,
                'unique_scans' => 198,
                'last_scanned_at' => '2024-11-23 14:30:00',
                'created_at' => '2024-11-20 10:00:00',
                'updated_at' => '2024-11-23 14:30:00',
                'design' => [
                    'foreground_color' => '#000000',
                    'background_color' => '#FFFFFF',
                    'pattern' => 'square',
                    'error_correction' => 'M'
                ],
                'user_id' => 1
            ]
        ]);
    }

    public function edit($id)
    {
        // Reusing Create component for now, or create a separate Edit component
        return Inertia::render('QRCode/Create', [
            'qrcode' => [
                'id' => $id,
                'name' => 'Website Homepage',
                'type' => 'url',
                'content' => 'https://example.com',
                'destination_url' => 'https://example.com',
                'is_active' => true,
                'scan_count' => 245,
                'unique_scans' => 198,
                'last_scanned_at' => '2024-11-23 14:30:00',
                'created_at' => '2024-11-20 10:00:00',
                'updated_at' => '2024-11-23 14:30:00',
                'design' => [
                    'foreground_color' => '#000000',
                    'background_color' => '#FFFFFF',
                    'pattern' => 'square',
                    'error_correction' => 'M'
                ],
                'user_id' => 1
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        // Update logic would go here
        return redirect()->route('qr-codes.show', $id)->with('success', 'QR Code updated successfully.');
    }

    public function destroy($id)
    {
        // Delete logic would go here
        return redirect()->route('qr-codes.index')->with('success', 'QR Code deleted successfully.');
    }
}
