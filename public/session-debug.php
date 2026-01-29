<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<h1>Session Debug</h1>";

// Check if user is logged in
$user = auth()->user();
if (!$user) {
    echo "<h3 style='color:red'>ERROR: Not logged in</h3>";
    echo "<p>Please log in first, then visit this page again.</p>";
    exit;
}

echo "Logged in as: <strong>{$user->name}</strong> ({$user->email})<br><br>";

// Check session
echo "<h2>Session Data:</h2>";
echo "organization_id in session: <strong>" . (session('organization_id') ?? 'NOT SET') . "</strong><br>";

// Check user's organizations
$orgs = $user->organizations;
echo "<br><h2>User's Organizations:</h2>";
if ($orgs->count() > 0) {
    foreach ($orgs as $org) {
        echo "- ID: {$org->id}, Name: {$org->name}<br>";
    }
} else {
    echo "<strong style='color:red'>No organizations found!</strong><br>";
}

// Check current organization
$currentOrg = $user->currentOrganization();
echo "<br><h2>Current Organization (from helper):</h2>";
if ($currentOrg) {
    echo "ID: {$currentOrg->id}, Name: {$currentOrg->name}<br>";
} else {
    echo "<strong style='color:red'>No current organization!</strong><br>";
}

// Try to manually set it
if ($orgs->count() > 0 && !session('organization_id')) {
    session(['organization_id' => $orgs->first()->id]);
    echo "<br><p style='color:green'>Manually set organization_id to: {$orgs->first()->id}</p>";
    echo "<p>Now try sending an invitation again!</p>";
}
