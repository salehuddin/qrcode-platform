<?php

namespace App\Helpers;

class FeatureHelper
{
    /**
     * Check if a feature is enabled.
     */
    public static function enabled(string $feature): bool
    {
        return config("features.features.{$feature}", false);
    }

    /**
     * Check if running in SaaS edition.
     */
    public static function isSaas(): bool
    {
        return config('features.edition') === 'saas';
    }

    /**
     * Check if running in Internal edition.
     */
    public static function isInternal(): bool
    {
        return config('features.edition') === 'internal';
    }

    /**
     * Get the current edition.
     */
    public static function edition(): string
    {
        return config('features.edition', 'internal');
    }
}
