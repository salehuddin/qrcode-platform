<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationPreferencesController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Display user notification preferences
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $preferences = $this->notificationService->getUserPreferences($user);

        return Inertia::render('Settings/NotificationPreferences', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update user notification preference
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'notification_type' => 'required|string',
            'is_enabled' => 'required|boolean',
        ]);

        try {
            $this->notificationService->updateUserPreference(
                $request->user(),
                $validated['notification_type'],
                $validated['is_enabled']
            );

            return back()->with('success', 'Notification preference updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
