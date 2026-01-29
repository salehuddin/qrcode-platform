<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "<h1>Direct Notification Settings Insert</h1>";

try {
    $notifications = [
        ['notification_type' => 'welcome', 'is_enabled' => true, 'description' => 'Welcome email sent when user accepts invitation or registers'],
        ['notification_type' => 'password_reset', 'is_enabled' => true, 'description' => 'Password reset email with reset link'],
        ['notification_type' => 'scan_alert', 'is_enabled' => true, 'description' => 'Alert when QR code reaches scan threshold (100, 500, 1000, etc.)'],
        ['notification_type' => 'subscription_payment_success', 'is_enabled' => true, 'description' => 'Payment confirmation email'],
        ['notification_type' => 'subscription_renewal', 'is_enabled' => true, 'description' => 'Subscription renewal notification'],
        ['notification_type' => 'subscription_payment_failed', 'is_enabled' => true, 'description' => 'Failed payment notification'],
        ['notification_type' => 'activity_member_joined', 'is_enabled' => true, 'description' => 'Notification when new member joins organization'],
        ['notification_type' => 'activity_member_removed', 'is_enabled' => true, 'description' => 'Notification when member is removed from organization'],
        ['notification_type' => 'activity_role_changed', 'is_enabled' => true, 'description' => 'Notification when member role is changed'],
        ['notification_type' => 'export_ready', 'is_enabled' => true, 'description' => 'Notification when QR code export is ready for download'],
    ];

    $inserted = 0;
    $updated = 0;

    foreach ($notifications as $notification) {
        $existing = \App\Models\NotificationSetting::where('notification_type', $notification['notification_type'])->first();
        
        if ($existing) {
            $existing->update($notification);
            $updated++;
            echo "<p>✓ Updated: {$notification['notification_type']}</p>";
        } else {
            \App\Models\NotificationSetting::create($notification);
            $inserted++;
            echo "<p>✓ Inserted: {$notification['notification_type']}</p>";
        }
    }

    echo "<hr>";
    echo "<h2 style='color:green;'>✅ SUCCESS!</h2>";
    echo "<p><strong>Inserted:</strong> $inserted new records</p>";
    echo "<p><strong>Updated:</strong> $updated existing records</p>";
    
    // Verify
    $total = \App\Models\NotificationSetting::count();
    echo "<p><strong>Total in database:</strong> $total</p>";
    
    if ($total === 10) {
        echo "<p style='color:green;font-size:18px;'><strong>✅ All 10 notification types are now in the database!</strong></p>";
        echo "<p>You can now visit the notification settings page and it should work.</p>";
    } else {
        echo "<p style='color:orange;'><strong>⚠️ Warning: Expected 10 records but found $total</strong></p>";
    }
    
    echo "<hr>";
    echo "<p style='color:red;'><strong>⚠️ IMPORTANT: Delete this file immediately!</strong></p>";
    echo "<p>File: <code>public/insert-notifications.php</code></p>";
    
} catch (\Exception $e) {
    echo "<h2 style='color:red;'>❌ ERROR</h2>";
    echo "<p><strong>Message:</strong> " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
