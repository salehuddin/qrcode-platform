<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QRCodeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    // Mock dashboard data
    return Inertia::render('Dashboard', [
        'stats' => [
            'total_qr_codes' => 12,
            'active_qr_codes' => 10,
            'total_scans' => 1250,
            'scans_this_month' => 450,
            'top_performing_codes' => [
                 [
                    'id' => '1',
                    'name' => 'Website Homepage',
                    'type' => 'url',
                    'scan_count' => 245,
                 ],
                 [
                    'id' => '2',
                    'name' => 'Fall Campaign',
                    'type' => 'url',
                    'scan_count' => 180,
                 ]
            ],
            'recent_scans' => []
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/analytics', function () {
    // Mock analytics data for Phase 2
    return Inertia::render('Analytics/Dashboard', [
        'summary' => [
            'total_scans' => 1250,
            'unique_scanners' => 980,
            'scans_this_month' => 450,
            'active_qr_codes' => 10,
        ],
        'scansOverTime' => [
            ['label' => 'Mon', 'value' => 120],
            ['label' => 'Tue', 'value' => 95],
            ['label' => 'Wed', 'value' => 160],
            ['label' => 'Thu', 'value' => 110],
            ['label' => 'Fri', 'value' => 190],
            ['label' => 'Sat', 'value' => 230],
            ['label' => 'Sun', 'value' => 160],
        ],
        'deviceBreakdown' => [
            ['label' => 'Mobile', 'value' => 820, 'percent' => 66],
            ['label' => 'Desktop', 'value' => 310, 'percent' => 25],
            ['label' => 'Tablet', 'value' => 120, 'percent' => 9],
        ],
        'osBreakdown' => [
            ['label' => 'iOS', 'value' => 480, 'percent' => 38],
            ['label' => 'Android', 'value' => 420, 'percent' => 34],
            ['label' => 'Windows', 'value' => 210, 'percent' => 17],
            ['label' => 'macOS', 'value' => 140, 'percent' => 11],
        ],
        'topQrCodes' => [
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
                'customization' => null,
                'user_id' => 1,
            ],
            [
                'id' => '2',
                'name' => 'Fall Campaign',
                'type' => 'url',
                'content' => 'https://example.com/fall',
                'destination_url' => 'https://example.com/fall',
                'is_active' => true,
                'scan_count' => 180,
                'unique_scans' => 150,
                'last_scanned_at' => '2024-11-22 18:15:00',
                'created_at' => '2024-11-10 09:30:00',
                'updated_at' => '2024-11-22 18:15:00',
                'design' => [
                    'foreground_color' => '#000000',
                    'background_color' => '#FFFFFF',
                    'pattern' => 'dots',
                    'error_correction' => 'Q',
                ],
                'customization' => null,
                'user_id' => 1,
            ],
        ],
        'conversionFunnel' => [
            ['label' => 'Total Scans', 'value' => 1250],
            ['label' => 'Unique Visitors', 'value' => 980],
            ['label' => 'Landing Page Views', 'value' => 640],
            ['label' => 'Signups', 'value' => 210],
        ],
    ]);
})->middleware(['auth', 'verified'])->name('analytics');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin', function () {
        // Mock admin dashboard data
        return Inertia::render('Admin/Dashboard', [
            'platformStats' => [
                ['label' => 'Total Users', 'value' => 1280, 'sublabel' => 'All active accounts'],
                ['label' => 'Organizations', 'value' => 42, 'sublabel' => 'Teams & companies'],
                ['label' => 'Active Subscriptions', 'value' => 310, 'sublabel' => 'Paid plans'],
                ['label' => 'Scans (24h)', 'value' => 8450, 'sublabel' => 'Across all QR codes'],
            ],
            'userGrowth' => [
                ['label' => 'Mon', 'value' => 25],
                ['label' => 'Tue', 'value' => 30],
                ['label' => 'Wed', 'value' => 45],
                ['label' => 'Thu', 'value' => 40],
                ['label' => 'Fri', 'value' => 55],
                ['label' => 'Sat', 'value' => 38],
                ['label' => 'Sun', 'value' => 32],
            ],
            'systemHealth' => [
                'status' => 'healthy',
                'incidentsOpen' => 0,
                'lastIncident' => 'Minor latency on EU cluster (2 days ago)',
            ],
            'revenueSummary' => [
                'mrr' => 12450,
                'arr' => 12450 * 12,
                'arpu' => 39.5,
                'churnRate' => 2.3,
            ],
            'recentActivity' => [
                [
                    'id' => 1,
                    'type' => 'user',
                    'message' => 'New user "Acme Inc" signed up for Pro plan.',
                    'created_at' => '2024-11-24T09:15:00Z',
                ],
                [
                    'id' => 2,
                    'type' => 'subscription',
                    'message' => 'Subscription upgraded: "Contoso" from Basic to Pro.',
                    'created_at' => '2024-11-24T08:30:00Z',
                ],
                [
                    'id' => 3,
                    'type' => 'support',
                    'message' => 'New support ticket from "MarketingCo" about scan limits.',
                    'created_at' => '2024-11-23T18:05:00Z',
                ],
            ],
        ]);
    })->name('admin.dashboard');

    Route::get('/admin/users', function () {
        // Mock admin user list
        $users = [
            [
                'id' => 1,
                'name' => 'Alice Admin',
                'email' => 'alice@example.com',
                'email_verified_at' => '2024-11-01 10:00:00',
                'created_at' => '2024-10-15 09:00:00',
                'updated_at' => '2024-11-23 14:00:00',
                'role' => 'admin',
                'status' => 'active',
                'organization' => 'Platform Owners',
                'plan' => 'Internal',
                'last_seen_at' => '2024-11-24 08:45:00',
            ],
            [
                'id' => 2,
                'name' => 'Bob Editor',
                'email' => 'bob@example.com',
                'email_verified_at' => '2024-11-05 12:00:00',
                'created_at' => '2024-11-05 11:00:00',
                'updated_at' => '2024-11-23 12:30:00',
                'role' => 'editor',
                'status' => 'active',
                'organization' => 'Acme Inc',
                'plan' => 'Pro',
                'last_seen_at' => '2024-11-24 07:10:00',
            ],
            [
                'id' => 3,
                'name' => 'Charlie Viewer',
                'email' => 'charlie@example.com',
                'email_verified_at' => null,
                'created_at' => '2024-11-10 15:20:00',
                'updated_at' => '2024-11-20 10:05:00',
                'role' => 'viewer',
                'status' => 'invited',
                'organization' => 'Contoso',
                'plan' => 'Free',
                'last_seen_at' => null,
            ],
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    })->name('admin.users');

    Route::get('/qr-codes/{id}/analytics', function (string $id) {
        // Mock QR-specific analytics data
        $qrcode = [
            'id' => $id,
            'name' => $id === '2' ? 'Fall Campaign' : 'Website Homepage',
            'type' => 'url',
            'content' => $id === '2' ? 'https://example.com/fall' : 'https://example.com',
            'destination_url' => $id === '2' ? 'https://example.com/fall' : 'https://example.com',
            'is_active' => true,
            'scan_count' => $id === '2' ? 180 : 245,
            'unique_scans' => $id === '2' ? 150 : 198,
            'last_scanned_at' => '2024-11-23 14:30:00',
            'created_at' => '2024-11-20 10:00:00',
            'updated_at' => '2024-11-23 14:30:00',
            'design' => [
                'foreground_color' => '#000000',
                'background_color' => '#FFFFFF',
                'pattern' => $id === '2' ? 'dots' : 'square',
                'error_correction' => $id === '2' ? 'Q' : 'M',
            ],
            'customization' => null,
            'user_id' => 1,
        ];

        $scansOverTime = [
            ['label' => 'Mon', 'value' => 25],
            ['label' => 'Tue', 'value' => 30],
            ['label' => 'Wed', 'value' => 40],
            ['label' => 'Thu', 'value' => 35],
            ['label' => 'Fri', 'value' => 50],
            ['label' => 'Sat', 'value' => 60],
            ['label' => 'Sun', 'value' => 30],
        ];

        $deviceBreakdown = [
            ['label' => 'Mobile', 'value' => 160, 'percent' => 70],
            ['label' => 'Desktop', 'value' => 50, 'percent' => 22],
            ['label' => 'Tablet', 'value' => 20, 'percent' => 8],
        ];

        $locationBreakdown = [
            ['label' => 'United States', 'value' => 140, 'percent' => 60],
            ['label' => 'United Kingdom', 'value' => 40, 'percent' => 17],
            ['label' => 'Canada', 'value' => 30, 'percent' => 13],
            ['label' => 'Other', 'value' => 20, 'percent' => 10],
        ];

        $referrers = [
            ['source' => 'Direct / QR', 'scans' => 180, 'percent' => 72],
            ['source' => 'Website Landing Page', 'scans' => 50, 'percent' => 20],
            ['source' => 'Social Campaign', 'scans' => 20, 'percent' => 8],
        ];

        $peakHours = [
            ['label' => '09:00 - 12:00', 'value' => 60],
            ['label' => '12:00 - 15:00', 'value' => 80],
            ['label' => '15:00 - 18:00', 'value' => 55],
            ['label' => '18:00 - 21:00', 'value' => 40],
        ];

        $recentScans = [
            [
                'id' => 'scan-1',
                'qr_code_id' => $id,
                'ip_address' => '192.168.1.10',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
                'device_type' => 'Mobile',
                'browser' => 'Safari',
                'os' => 'iOS',
                'country' => 'United States',
                'city' => 'New York',
                'scanned_at' => '2024-11-23 14:30:00',
            ],
            [
                'id' => 'scan-2',
                'qr_code_id' => $id,
                'ip_address' => '192.168.1.11',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 14)',
                'device_type' => 'Mobile',
                'browser' => 'Chrome',
                'os' => 'Android',
                'country' => 'United States',
                'city' => 'San Francisco',
                'scanned_at' => '2024-11-23 13:15:00',
            ],
            [
                'id' => 'scan-3',
                'qr_code_id' => $id,
                'ip_address' => '192.168.1.12',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'device_type' => 'Desktop',
                'browser' => 'Edge',
                'os' => 'Windows',
                'country' => 'Canada',
                'city' => 'Toronto',
                'scanned_at' => '2024-11-22 18:45:00',
            ],
        ];

        return Inertia::render('Analytics/QRCodeAnalytics', [
            'qrcode' => $qrcode,
            'scansOverTime' => $scansOverTime,
            'deviceBreakdown' => $deviceBreakdown,
            'locationBreakdown' => $locationBreakdown,
            'referrers' => $referrers,
            'peakHours' => $peakHours,
            'recentScans' => $recentScans,
        ]);
    })->name('qr-codes.analytics');

    Route::resource('qr-codes', QRCodeController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
