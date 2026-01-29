<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<h1>Invitation Email Test</h1>";

// Get test email from query param
$email = $_GET['email'] ?? 'test@example.com';

echo "Testing invitation email to: <strong>$email</strong><br><br>";

try {
    // Get first organization and user
    $org = \App\Models\Organization::first();
    $user = \App\Models\User::first();
    
    if (!$org || !$user) {
        echo "<h3 style='color:red'>ERROR: No organization or user found in database</h3>";
        exit;
    }
    
    echo "Using Organization: {$org->name}<br>";
    echo "Using Inviter: {$user->name}<br><br>";
    
    // Create a test invitation
    $invitation = \App\Models\Invitation::create([
        'organization_id' => $org->id,
        'invited_by' => $user->id,
        'email' => $email,
        'role' => 'viewer',
        'token' => \Illuminate\Support\Str::random(32),
        'expires_at' => now()->addDays(7),
    ]);
    
    echo "Invitation created in database (ID: {$invitation->id})<br><br>";
    
    // Try to send the email
    echo "Attempting to send email...<br>";
    
    Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\TeamInvitation($invitation));
    
    echo "<h3 style='color:green'>SUCCESS! Email sent.</h3>";
    echo "<p>Check SendGrid logs and your inbox.</p>";
    
    // Clean up test invitation
    $invitation->delete();
    echo "<p><em>Test invitation deleted from database.</em></p>";
    
} catch (\Exception $e) {
    echo "<h3 style='color:red'>FAILURE: Exception thrown!</h3>";
    echo "<pre>" . $e->getMessage() . "</pre>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
