<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Application Edition
    |--------------------------------------------------------------------------
    |
    | Determines which edition of the platform is running:
    | - 'internal': Single-tenant for internal use
    | - 'saas': Multi-tenant SaaS platform
    |
    */

    'edition' => env('APP_EDITION', 'internal'),

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | These flags control which features are enabled based on the edition.
    | If not explicitly set, defaults are derived from the edition.
    |
    */

    // Multi-tenant support (SaaS only)
    'multi_tenant' => env('FEATURE_MULTI_TENANT') ?? (env('APP_EDITION', 'internal') === 'saas'),
    
    // Billing and subscription management (SaaS only)
    'billing' => env('FEATURE_BILLING') ?? (env('APP_EDITION', 'internal') === 'saas'),
    
    // Usage limits per plan (SaaS only)
    'usage_limits' => env('FEATURE_USAGE_LIMITS') ?? (env('APP_EDITION', 'internal') === 'saas'),
    
    // Organization creation UI (SaaS only, internal has default org)
    'organization_creation' => env('FEATURE_ORG_CREATION') ?? (env('APP_EDITION', 'internal') === 'saas'),
    
    // Team management (both editions)
    'team_management' => env('FEATURE_TEAM_MANAGEMENT', true),
    
    // Client management (both editions)
    'client_management' => env('FEATURE_CLIENT_MANAGEMENT', true),
    
    // Project management (both editions)
    'project_management' => env('FEATURE_PROJECT_MANAGEMENT', true),
    
    // Marketing site (SaaS only)
    'marketing_site' => env('FEATURE_MARKETING_SITE') ?? (env('APP_EDITION', 'internal') === 'saas'),
    
    // API keys (SaaS only)
    'api_keys' => env('FEATURE_API_KEYS') ?? (env('APP_EDITION', 'internal') === 'saas'),
];
