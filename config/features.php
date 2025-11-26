<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Application Edition
    |--------------------------------------------------------------------------
    |
    | High-level edition switch. Use this to decide sensible defaults for
    | feature flags. Valid values: 'internal', 'saas'.
    |
    */

    'edition' => env('APP_EDITION', 'internal'),

    /*
    |--------------------------------------------------------------------------
    | Core Feature Flags
    |--------------------------------------------------------------------------
    |
    | Each flag can be overridden via environment variables. If not explicitly
    | set, we derive a default from the edition.
    |
    */

    'billing' => env('FEATURE_BILLING') ?? (env('APP_EDITION', 'internal') === 'saas'),

    'team_management' => env('FEATURE_TEAM_MANAGEMENT') ?? (env('APP_EDITION', 'internal') === 'saas'),

    'marketing_site' => env('FEATURE_MARKETING_SITE') ?? (env('APP_EDITION', 'internal') === 'saas'),

    'api_keys' => env('FEATURE_API_KEYS') ?? (env('APP_EDITION', 'internal') === 'saas'),
];
