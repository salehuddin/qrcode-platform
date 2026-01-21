<?php

namespace App\Providers;

use App\Services\EmailConfigService;
use Illuminate\Support\ServiceProvider;

class EmailServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register EmailConfigService as singleton
        $this->app->singleton(EmailConfigService::class, function ($app) {
            return new EmailConfigService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Apply email configuration from database on application boot
        if ($this->app->runningInConsole() === false) {
            try {
                $emailConfigService = $this->app->make(EmailConfigService::class);
                $emailConfigService->applyEmailConfig();
            } catch (\Exception $e) {
                // Silently fail if database is not ready (e.g., during migration)
                \Log::debug('Email config not applied: ' . $e->getMessage());
            }
        }
    }
}
