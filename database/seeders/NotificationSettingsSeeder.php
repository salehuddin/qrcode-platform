<?php

namespace Database\Seeders;

use App\Models\NotificationSetting;
use Illuminate\Database\Seeder;

class NotificationSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notifications = [
            [
                'notification_type' => 'welcome',
                'is_enabled' => true,
                'description' => 'Welcome email sent when user accepts invitation or registers',
            ],
            [
                'notification_type' => 'password_reset',
                'is_enabled' => true,
                'description' => 'Password reset email with reset link',
            ],
            [
                'notification_type' => 'scan_alert',
                'is_enabled' => true,
                'description' => 'Alert when QR code reaches scan threshold (100, 500, 1000, etc.)',
            ],
            [
                'notification_type' => 'subscription_payment_success',
                'is_enabled' => true,
                'description' => 'Payment confirmation email',
            ],
            [
                'notification_type' => 'subscription_renewal',
                'is_enabled' => true,
                'description' => 'Subscription renewal notification',
            ],
            [
                'notification_type' => 'subscription_payment_failed',
                'is_enabled' => true,
                'description' => 'Failed payment notification',
            ],
            [
                'notification_type' => 'activity_member_joined',
                'is_enabled' => true,
                'description' => 'Notification when new member joins organization',
            ],
            [
                'notification_type' => 'activity_member_removed',
                'is_enabled' => true,
                'description' => 'Notification when member is removed from organization',
            ],
            [
                'notification_type' => 'activity_role_changed',
                'is_enabled' => true,
                'description' => 'Notification when member role is changed',
            ],
            [
                'notification_type' => 'export_ready',
                'is_enabled' => true,
                'description' => 'Notification when QR code export is ready for download',
            ],
        ];

        foreach ($notifications as $notification) {
            NotificationSetting::updateOrCreate(
                ['notification_type' => $notification['notification_type']],
                $notification
            );
        }
    }
}
