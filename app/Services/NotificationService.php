<?php

namespace App\Services;

use App\Models\User;
use App\Models\QRCode;
use App\Models\NotificationSetting;
use App\Models\UserNotificationPreference;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Check if a notification can be sent to a user
     */
    public function canSendNotification(User $user, string $type): bool
    {
        // Check if notification type is enabled system-wide
        if (!NotificationSetting::isEnabled($type)) {
            return false;
        }

        // Check if user has enabled this notification
        if (!UserNotificationPreference::isEnabledForUser($user->id, $type)) {
            return false;
        }

        return true;
    }

    /**
     * Send welcome email to new user
     */
    public function sendWelcomeEmail(User $user): void
    {
        if (!$this->canSendNotification($user, 'welcome')) {
            return;
        }

        Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user));
    }

    /**
     * Send QR scan alert notification
     */
    public function sendScanAlert(QRCode $qrCode, int $scanCount): void
    {
        $user = $qrCode->user;
        
        if (!$user || !$this->canSendNotification($user, 'scan_alert')) {
            return;
        }

        Mail::to($user->email)->send(new \App\Mail\QRScanAlert($qrCode, $scanCount));
    }

    /**
     * Send activity notification
     */
    public function sendActivityNotification(User $user, string $activityType, array $data = []): void
    {
        $notificationType = "activity_{$activityType}";
        
        if (!$this->canSendNotification($user, $notificationType)) {
            return;
        }

        Mail::to($user->email)->send(new \App\Mail\ActivityNotification($user, $activityType, $data));
    }

    /**
     * Send subscription/billing email
     */
    public function sendSubscriptionEmail(User $user, string $emailType, array $data = []): void
    {
        $notificationType = "subscription_{$emailType}";
        
        if (!$this->canSendNotification($user, $notificationType)) {
            return;
        }

        Mail::to($user->email)->send(new \App\Mail\SubscriptionEmail($user, $emailType, $data));
    }

    /**
     * Send export ready notification
     */
    public function sendExportReady(User $user, string $downloadUrl, QRCode $qrCode, string $format = 'PNG'): void
    {
        if (!$this->canSendNotification($user, 'export_ready')) {
            return;
        }

        Mail::to($user->email)->send(new \App\Mail\ExportReadyEmail($user, $downloadUrl, $qrCode, $format));
    }

    /**
     * Get user's notification preferences
     */
    public function getUserPreferences(User $user): array
    {
        $allTypes = NotificationSetting::all();
        $userPreferences = $user->notificationPreferences()->pluck('is_enabled', 'notification_type')->toArray();

        $preferences = [];
        foreach ($allTypes as $type) {
            $preferences[] = [
                'type' => $type->notification_type,
                'description' => $type->description,
                'system_enabled' => $type->is_enabled,
                'user_enabled' => $userPreferences[$type->notification_type] ?? true,
                'can_change' => $type->is_enabled, // User can only change if system allows
            ];
        }

        return $preferences;
    }

    /**
     * Update user's notification preference
     */
    public function updateUserPreference(User $user, string $type, bool $enabled): void
    {
        // Check if notification type exists and is enabled system-wide
        $setting = NotificationSetting::where('notification_type', $type)->first();
        
        if (!$setting) {
            throw new \Exception("Invalid notification type: {$type}");
        }

        // User can't enable a notification that's disabled system-wide
        if ($enabled && !$setting->is_enabled) {
            throw new \Exception("This notification type is disabled system-wide");
        }

        UserNotificationPreference::updateOrCreate(
            [
                'user_id' => $user->id,
                'notification_type' => $type,
            ],
            [
                'is_enabled' => $enabled,
            ]
        );
    }

    /**
     * Get notification statistics
     */
    public function getStatistics(): array
    {
        return [
            'total_types' => NotificationSetting::count(),
            'enabled_types' => NotificationSetting::where('is_enabled', true)->count(),
            'total_user_preferences' => UserNotificationPreference::count(),
            'users_with_preferences' => UserNotificationPreference::distinct('user_id')->count(),
        ];
    }
}
