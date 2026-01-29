<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "<h1>Seeding Notification Settings</h1>";

try {
    // Run the NotificationSettingsSeeder
    Artisan::call('db:seed', ['--class' => 'NotificationSettingsSeeder']);
    
    echo "<p style='color:green;font-size:18px;'><strong>✅ SUCCESS!</strong></p>";
    echo "<p>Notification settings have been seeded successfully.</p>";
    echo "<p>10 notification types have been added to the database.</p>";
    
    // Show what was seeded
    $settings = \App\Models\NotificationSetting::all();
    echo "<h2>Seeded Notification Types:</h2>";
    echo "<ul>";
    foreach ($settings as $setting) {
        echo "<li><strong>{$setting->notification_type}</strong> - " . ($setting->is_enabled ? 'Enabled' : 'Disabled') . "</li>";
    }
    echo "</ul>";
    
    echo "<hr>";
    echo "<p style='color:red;'><strong>⚠️ IMPORTANT: Please delete this file immediately for security!</strong></p>";
    echo "<p>File location: <code>public/seed-notifications.php</code></p>";
    
} catch (\Exception $e) {
    echo "<p style='color:red;'><strong>❌ ERROR:</strong> " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
