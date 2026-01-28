<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Clear caches
echo "Clearing caches...<br>";
try {
    Illuminate\Support\Facades\Artisan::call('config:clear');
    echo "Config cleared.<br>";
    Illuminate\Support\Facades\Artisan::call('route:clear');
    echo "Routes cleared.<br>";
    Illuminate\Support\Facades\Artisan::call('cache:clear');
    echo "App Cache cleared.<br>";
    Illuminate\Support\Facades\Artisan::call('view:clear');
    echo "Views cleared.<br>";
    echo "<h1>DONE! ALL CACHES CLEARED.</h1>";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
