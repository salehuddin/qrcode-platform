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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('qr-codes', QRCodeController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
