<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserNotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'notification_type',
        'is_enabled',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    /**
     * Get the user that owns the preference
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if user has enabled a specific notification
     */
    public static function isEnabledForUser(int $userId, string $type): bool
    {
        $preference = static::where('user_id', $userId)
            ->where('notification_type', $type)
            ->first();

        // If no preference set, default to true
        return $preference ? $preference->is_enabled : true;
    }
}
