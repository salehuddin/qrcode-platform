<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QRCodeController extends Controller
{
    public function index()
    {
        // Static mock data so we can test views & flow without a database table yet
        $qrCodes = [
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
                    'error_correction' => 'M',
                ],
                'user_id' => 1,
            ],
            [
                'id' => '2',
                'name' => 'WiFi Access',
                'type' => 'wifi',
                'content' => 'WIFI:T:WPA;S:MyNetwork;P:password;;',
                'destination_url' => null,
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
                    'error_correction' => 'Q',
                ],
                'user_id' => 1,
            ],
        ];

        $stats = [
            'total_qr_codes' => count($qrCodes),
            'active_qr_codes' => count(array_filter($qrCodes, fn ($qr) => $qr['is_active'])),
            'total_scans' => array_sum(array_column($qrCodes, 'scan_count')),
            'scans_this_month' => 0,
            'top_performing_codes' => $qrCodes,
            'recent_scans' => [],
        ];

        return Inertia::render('QRCode/Index', [
            'qrCodes' => $qrCodes,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('QRCode/Create');
    }

    public function store(Request $request)
    {
        // Validate the payload but do not persist yet; we just feed it into the Show view
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'mode' => ['required', 'string', 'in:static,dynamic'],
            'type' => ['required', 'string', 'max:50'],
            'content' => ['required', 'string'],
            'permalink' => ['nullable', 'string', 'max:255'],
            'destination_url' => ['nullable', 'url', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'design' => ['nullable', 'array'],
            'customization' => ['nullable', 'array'],
        ]);

        $now = now()->toDateTimeString();

        $design = $validated['design'] ?? [
            'foreground_color' => '#000000',
            'background_color' => '#FFFFFF',
            'pattern' => 'square',
            'error_correction' => 'M',
        ];

        $qrCode = [
            'id' => 'preview',
            'name' => $validated['name'] ?? 'Preview QR Code',
            'description' => $validated['description'] ?? null,
            'mode' => $validated['mode'],
            'permalink' => $validated['permalink'] ?? null,
            'type' => $validated['type'],
            'content' => $validated['content'],
            'destination_url' => $validated['destination_url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'scan_count' => 0,
            'unique_scans' => 0,
            'last_scanned_at' => null,
            'created_at' => $now,
            'updated_at' => $now,
            'design' => $design,
            'customization' => $validated['customization'] ?? null,
            'user_id' => $request->user()->id,
        ];

        return Inertia::render('QRCode/Show', [
            'qrcode' => $qrCode,
        ]);
    }

    public function show($id)
    {
        // Static example for direct /qr-codes/{id} navigation
        $qrCode = [
            'id' => (string) $id,
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
                'error_correction' => 'M',
            ],
            'customization' => null,
            'user_id' => 1,
        ];

        return Inertia::render('QRCode/Show', [
            'qrcode' => $qrCode,
        ]);
    }

    public function edit($id)
    {
        // Static example QR for editing; no persistence yet
        $qrCode = [
            'id' => (string) $id,
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
                'error_correction' => 'M',
            ],
            'customization' => null,
            'user_id' => 1,
        ];

        return Inertia::render('QRCode/Create', [
            'qrcode' => $qrCode,
        ]);
    }

    public function update(Request $request, $id)
    {
        // No-op update while we are still mocking data
        return redirect()
            ->route('qr-codes.show', $id)
            ->with('success', 'QR Code updated successfully (mock).');
    }

    public function destroy(Request $request, $id)
    {
        // No-op delete while using mock data
        return redirect()
            ->route('qr-codes.index')
            ->with('success', 'QR Code deleted successfully (mock).');
    }
}
