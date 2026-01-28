<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<h1>Email Diagnostic Tool</h1>";

// 1. Check Queue Config
echo "<h2>1. Queue Configuration</h2>";
echo "Current Queue Driver: <strong>" . config('queue.default') . "</strong><br>";
echo "(Should be 'sync' for immediate sending. If 'database', emails might be stuck in the database table.)<br>";

// 2. Check Mail Config
echo "<h2>2. Mail Configuration</h2>";
echo "Current Mail Default: <strong>" . config('mail.default') . "</strong><br>";

$driver = config('mail.default');
$mailConfig = config("mail.mailers.{$driver}");

if ($mailConfig) {
    echo "Host: " . ($mailConfig['host'] ?? 'N/A') . "<br>";
    echo "Port: " . ($mailConfig['port'] ?? 'N/A') . "<br>";
    echo "Encryption: " . ($mailConfig['encryption'] ?? 'N/A') . "<br>";
    echo "Username: " . ($mailConfig['username'] ?? 'N/A') . "<br>";
    echo "Password: " . (isset($mailConfig['password']) ? '****** (Set)' : 'Not Set') . "<br>";
} else {
    echo "No config found for driver '{$driver}'<br>";
}

// 3. Try DB Config Override
echo "<h2>3. Checking Database Settings override</h2>";
try {
    $service = new \App\Services\EmailConfigService();
    $active = $service->getActiveConfig();
    if ($active) {
        echo "Found active settings in Database: Driver = " . $active->driver . "<br>";
        echo "Applying settings...<br>";
        $service->applyEmailConfig($active);
        echo "Re-checking Config: Host is now " . config('mail.mailers.'.$active->driver.'.host') . "<br>";
    } else {
        echo "No active settings found in database. Using .env values.<br>";
    }
} catch (\Exception $e) {
    echo "Error checking DB settings: " . $e->getMessage() . "<br>";
}

// 4. Attempt Send
echo "<h2>4. Attempting to Send Email...</h2>";
$to = 'web@lightup7.com'; // Default fallback or grab from query param ?email=...
if (isset($_GET['email'])) {
    $to = $_GET['email'];
}

echo "Target: $to <br>";

try {
    Illuminate\Support\Facades\Mail::raw('DEBUG TEST: This is a direct test from the diagnostic script.', function ($message) use ($to) {
        $message->to($to)
            ->subject('Debug Email Test - ' . date('Y-m-d H:i:s'));
    });
    echo "<h3 style='color:green'>SUCCESS: Mail::raw() executed without exception.</h3>";
} catch (\Exception $e) {
    echo "<h3 style='color:red'>FAILURE: Exception thrown!</h3>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
