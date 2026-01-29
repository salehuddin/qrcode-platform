<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<h1>Invitation Send Test (Full Flow)</h1>";

$user = auth()->user();
if (!$user) {
    echo "<h3 style='color:red'>ERROR: Not logged in</h3>";
    exit;
}

echo "Logged in as: <strong>{$user->name}</strong><br>";

$org = $user->currentOrganization();
if (!$org) {
    echo "<h3 style='color:red'>ERROR: No organization</h3>";
    exit;
}

echo "Organization: <strong>{$org->name}</strong> (ID: {$org->id})<br><br>";

// Get test email from query param
$email = $_GET['email'] ?? 'test@example.com';

echo "Testing invitation to: <strong>$email</strong><br><br>";

try {
    // Use the actual service
    $service = new \App\Services\InvitationService();
    
    echo "Creating invitation...<br>";
    $invitation = $service->createInvitation($org, $user, $email, 'viewer');
    
    echo "<h3 style='color:green'>SUCCESS!</h3>";
    echo "Invitation ID: {$invitation->id}<br>";
    echo "Token: {$invitation->token}<br>";
    echo "Email should have been sent to: {$invitation->email}<br>";
    
    // Check if invitation exists in database
    $check = \App\Models\Invitation::find($invitation->id);
    if ($check) {
        echo "<p style='color:green'>✓ Invitation saved in database</p>";
    }
    
    // Clean up
    $invitation->delete();
    echo "<p><em>Test invitation deleted from database.</em></p>";
    
} catch (\Exception $e) {
    echo "<h3 style='color:red'>FAILURE!</h3>";
    echo "<strong>Error:</strong> " . $e->getMessage() . "<br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<br><h2>Recent Laravel Logs (last 50 lines):</h2>";
echo "<pre style='background:#f5f5f5;padding:10px;overflow:auto;max-height:400px;'>";
$logFile = storage_path('logs/laravel.log');
if (file_exists($logFile)) {
    $lines = file($logFile);
    $recentLines = array_slice($lines, -50);
    echo htmlspecialchars(implode('', $recentLines));
} else {
    echo "No log file found.";
}
echo "</pre>";
