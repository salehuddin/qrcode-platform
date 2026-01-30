<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\RedirectController;
use App\Models\QrCode;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Public redirect route for QR code permalinks
Route::get('/r/{permalink}', [RedirectController::class, 'redirect'])->name('qr.redirect');

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/analytics/export', [App\Http\Controllers\AnalyticsController::class, 'export'])
    ->middleware(['auth', 'verified'])
    ->name('analytics.export');

Route::get('/analytics', [App\Http\Controllers\AnalyticsController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('analytics');

// No organization page for users without org access
Route::get('/no-organization', function () {
    return Inertia::render('NoOrganization');
})->middleware(['auth'])->name('no-organization');

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

    // Admin Template Management
    Route::get('/admin/templates', [App\Http\Controllers\Admin\TemplateController::class, 'index'])->name('admin.templates');
    Route::post('/admin/templates', [App\Http\Controllers\Admin\TemplateController::class, 'store'])->name('admin.templates.store');
    Route::delete('/admin/templates/{id}', [App\Http\Controllers\Admin\TemplateController::class, 'destroy'])->name('admin.templates.destroy');

    // Admin Email & Notification Settings (Platform Admin Only)
    Route::middleware(['platform.admin'])->group(function () {
        // Admin Email Settings
        Route::get('/admin/email-settings', [App\Http\Controllers\Admin\EmailSettingsController::class, 'index'])->name('admin.email-settings');
        Route::put('/admin/email-settings', [App\Http\Controllers\Admin\EmailSettingsController::class, 'update'])->name('admin.email-settings.update');
        Route::post('/admin/email-settings/test', [App\Http\Controllers\Admin\EmailSettingsController::class, 'test'])->name('admin.email-settings.test');

        // Admin Notification Settings
        Route::get('/admin/notification-settings', [App\Http\Controllers\Admin\NotificationSettingsController::class, 'index'])->name('admin.notification-settings');
        Route::post('/admin/notification-settings/toggle', [App\Http\Controllers\Admin\NotificationSettingsController::class, 'toggle'])->name('admin.notification-settings.toggle');
    });


    Route::get('/qr-codes/{qrCode}/analytics', [QRCodeController::class, 'analytics'])->name('qr-codes.analytics');
    
    // QR Code Status and Trash Routes
    Route::patch('/qr-codes/{qrCode}/toggle-status', [QRCodeController::class, 'toggleStatus'])->name('qr-codes.toggle-status');
    Route::post('/qr-codes/{id}/restore', [QRCodeController::class, 'restore'])->name('qr-codes.restore');
    Route::delete('/qr-codes/{id}/force-delete', [QRCodeController::class, 'forceDelete'])->name('qr-codes.force-delete');

    Route::get('/qr-codes/{qrCode}/download', [QRCodeController::class, 'download'])->name('qr-codes.download');
    Route::resource('qr-codes', QRCodeController::class);

    // Team Management Routes
    Route::middleware(['org.context'])->group(function () {
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/organization', [App\Http\Controllers\OrganizationController::class, 'show'])->name('organization.show');
            Route::put('/organization', [App\Http\Controllers\OrganizationController::class, 'update'])->name('organization.update');
            
            // User Notification Preferences
            Route::get('/notifications', [App\Http\Controllers\Settings\NotificationPreferencesController::class, 'index'])->name('notifications');
            Route::put('/notifications', [App\Http\Controllers\Settings\NotificationPreferencesController::class, 'update'])->name('notifications.update');
        });

        Route::resource('folders', App\Http\Controllers\FolderController::class);
        Route::put('/folders/{folder}/move', [App\Http\Controllers\FolderController::class, 'move'])->name('folders.move');

        Route::resource('tags', App\Http\Controllers\TagController::class);
        
        // Bulk operations for QR codes (organization-scoped)
        Route::post('/qr-codes/bulk-move', [QRCodeController::class, 'bulkMove'])->name('qr-codes.bulk-move');
        Route::post('/qr-codes/bulk-tags', [QRCodeController::class, 'bulkUpdateTags'])->name('qr-codes.bulk-tags');

        Route::post('/invitations', [App\Http\Controllers\InvitationController::class, 'store'])->name('invitations.store');
        Route::delete('/invitations/{invitation}', [App\Http\Controllers\InvitationController::class, 'destroy'])->name('invitations.destroy');
    });
});

// Invitation acceptance - must be accessible to unauthenticated users
Route::get('/invitations/{token}/accept', [App\Http\Controllers\InvitationController::class, 'accept'])->name('invitations.accept');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Preferences
    Route::get('/settings/preferences', [App\Http\Controllers\UserPreferencesController::class, 'edit'])->name('preferences.edit');
    Route::patch('/settings/preferences', [App\Http\Controllers\UserPreferencesController::class, 'update'])->name('preferences.update');


    // Team Management
    Route::get('/team', [App\Http\Controllers\TeamController::class, 'index'])->name('team.index');
    Route::get('/team/members/{user}', [App\Http\Controllers\TeamController::class, 'show'])->name('team.show');
    Route::post('/teams', [App\Http\Controllers\TeamController::class, 'store'])->name('teams.store');
    Route::post('/team/members', [App\Http\Controllers\TeamMemberController::class, 'store'])->name('team.members.store');
    Route::put('/team/members/{user}', [App\Http\Controllers\TeamMemberController::class, 'update'])->name('team.members.update');
    Route::delete('/team/members/{user}', [App\Http\Controllers\TeamMemberController::class, 'destroy'])->name('team.members.destroy');

    // Design Studio
    Route::get('/design', [App\Http\Controllers\DesignController::class, 'index'])->name('design.index');
    Route::post('/design/brand-kits', [App\Http\Controllers\DesignController::class, 'storeBrandKit'])->name('design.brand-kits.store');
    Route::delete('/design/brand-kits/{id}', [App\Http\Controllers\DesignController::class, 'deleteBrandKit'])->name('design.brand-kits.destroy');
    Route::post('/design/templates', [App\Http\Controllers\DesignController::class, 'storeTemplate'])->name('design.templates.store');
    
    // Shape Gallery
    Route::get('/design/shapes', [App\Http\Controllers\ShapeGalleryController::class, 'index'])->name('design.shapes');
    
    // Renderer Test
    Route::get('/design/renderer-test', [App\Http\Controllers\RendererTestController::class, 'index'])->name('design.renderer-test');
});

require __DIR__.'/auth.php';
