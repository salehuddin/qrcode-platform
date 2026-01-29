<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "<h1>Notification Settings Debug</h1>";

// Check database
$settings = \App\Models\NotificationSetting::all();
echo "<h2>Database Check:</h2>";
echo "<p>Total notification settings in database: <strong>" . $settings->count() . "</strong></p>";

if ($settings->count() > 0) {
    echo "<h3>Settings in Database:</h3>";
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>Type</th><th>Enabled</th><th>Description</th></tr>";
    foreach ($settings as $setting) {
        echo "<tr>";
        echo "<td>{$setting->notification_type}</td>";
        echo "<td>" . ($setting->is_enabled ? 'Yes' : 'No') . "</td>";
        echo "<td>{$setting->description}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p style='color:red;'><strong>❌ No settings found in database!</strong></p>";
}

// Test the service
echo "<h2>Service Test:</h2>";
$user = \App\Models\User::first();
if ($user) {
    echo "<p>Testing with user: <strong>{$user->name}</strong> ({$user->email})</p>";
    
    $service = new \App\Services\NotificationService();
    $preferences = $service->getUserPreferences($user);
    
    echo "<p>Preferences returned: <strong>" . count($preferences) . "</strong></p>";
    
    if (count($preferences) > 0) {
        echo "<h3>Preferences from Service:</h3>";
        echo "<pre>" . json_encode($preferences, JSON_PRETTY_PRINT) . "</pre>";
    } else {
        echo "<p style='color:red;'><strong>❌ Service returned empty array!</strong></p>";
    }
} else {
    echo "<p style='color:red;'><strong>❌ No users found!</strong></p>";
}

echo "<hr>";
echo "<p style='color:red;'><strong>⚠️ Delete this file after viewing!</strong></p>";
