<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $fillable = [
        'notification_type',
        'is_enabled',
        'description',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    /**
     * Check if a notification type is enabled
     */
    public static function isEnabled(string $type): bool
    {
        $setting = static::where('notification_type', $type)->first();
        return $setting ? $setting->is_enabled : false;
    }

    /**
     * Get all enabled notification types
     */
    public static function getEnabled(): array
    {
        return static::where('is_enabled', true)
            ->pluck('notification_type')
            ->toArray();
    }
}
