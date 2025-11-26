<?php

namespace App\Support;

class Feature
{
    public static function edition(): string
    {
        return config('features.edition', 'internal');
    }

    public static function isInternal(): bool
    {
        return self::edition() === 'internal';
    }

    public static function isSaas(): bool
    {
        return self::edition() === 'saas';
    }

    public static function enabled(string $feature): bool
    {
        return (bool) config("features.{$feature}", false);
    }

    public static function disabled(string $feature): bool
    {
        return ! self::enabled($feature);
    }
}
