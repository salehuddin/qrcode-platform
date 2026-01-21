<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationSettingsController extends Controller
{
    /**
     * Display notification settings page
     */
    public function index()
    {
        $notifications = NotificationSetting::all();

        return Inertia::render('Admin/NotificationSettings', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Toggle notification enabled/disabled
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'notification_type' => 'required|string',
            'is_enabled' => 'required|boolean',
        ]);

        try {
            $notification = NotificationSetting::where('notification_type', $validated['notification_type'])
                ->firstOrFail();

            $notification->update([
                'is_enabled' => $validated['is_enabled'],
            ]);

            $status = $validated['is_enabled'] ? 'enabled' : 'disabled';
            return back()->with('success', "Notification {$status} successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update notification: ' . $e->getMessage());
        }
    }
}
