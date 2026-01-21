<?php

namespace App\Services;

use App\Models\EmailSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

class EmailConfigService
{
    /**
     * Update email configuration in database
     */
    public function updateEmailConfig(array $config): EmailSetting
    {
        // Deactivate all existing configs
        EmailSetting::query()->update(['is_active' => false]);

        // Create or update the new config
        $emailSetting = EmailSetting::updateOrCreate(
            ['id' => $config['id'] ?? null],
            [
                'driver' => $config['driver'],
                'host' => $config['host'] ?? null,
                'port' => $config['port'] ?? null,
                'username' => $config['username'] ?? null,
                'password' => $config['password'] ?? null,
                'encryption' => $config['encryption'] ?? null,
                'from_address' => $config['from_address'],
                'from_name' => $config['from_name'],
                'is_active' => true,
            ]
        );

        // Apply the configuration immediately
        $this->applyEmailConfig($emailSetting);

        return $emailSetting;
    }

    /**
     * Apply email configuration to Laravel's mail config at runtime
     */
    public function applyEmailConfig(?EmailSetting $setting = null): void
    {
        $setting = $setting ?? EmailSetting::getActive();

        if (!$setting) {
            // Use default .env configuration
            return;
        }

        // Update mail configuration at runtime
        Config::set('mail.default', $setting->driver);
        
        // Configure based on driver
        switch ($setting->driver) {
            case 'smtp':
                Config::set('mail.mailers.smtp', [
                    'transport' => 'smtp',
                    'host' => $setting->host,
                    'port' => $setting->port,
                    'encryption' => $setting->encryption,
                    'username' => $setting->username,
                    'password' => $setting->password,
                    'timeout' => null,
                ]);
                break;

            case 'sendgrid':
                Config::set('mail.mailers.sendgrid', [
                    'transport' => 'smtp',
                    'host' => 'smtp.sendgrid.net',
                    'port' => 587,
                    'encryption' => 'tls',
                    'username' => 'apikey',
                    'password' => $setting->password, // SendGrid API key
                    'timeout' => null,
                ]);
                break;

            case 'mailgun':
                Config::set('services.mailgun', [
                    'domain' => $setting->host,
                    'secret' => $setting->password,
                ]);
                break;

            case 'ses':
                Config::set('services.ses', [
                    'key' => $setting->username,
                    'secret' => $setting->password,
                    'region' => $setting->host ?? 'us-east-1',
                ]);
                break;
        }

        // Set from address and name
        Config::set('mail.from', [
            'address' => $setting->from_address,
            'name' => $setting->from_name,
        ]);

        // Purge the mail manager to force reload
        app()->forgetInstance('mail.manager');
    }

    /**
     * Test email connection by sending a test email
     */
    public function testEmailConnection(string $testEmail): bool
    {
        try {
            // Apply current configuration
            $this->applyEmailConfig();

            // Send test email
            Mail::raw('This is a test email from QRCode Platform. If you received this, your email configuration is working correctly!', function ($message) use ($testEmail) {
                $message->to($testEmail)
                    ->subject('Test Email - QRCode Platform');
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email test failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get current active email configuration
     */
    public function getActiveConfig(): ?EmailSetting
    {
        return EmailSetting::getActive();
    }

    /**
     * Get configuration status
     */
    public function getConfigStatus(): array
    {
        $config = $this->getActiveConfig();

        if (!$config) {
            return [
                'configured' => false,
                'driver' => config('mail.default'),
                'from_address' => config('mail.from.address'),
                'from_name' => config('mail.from.name'),
                'source' => 'env',
            ];
        }

        return [
            'configured' => true,
            'driver' => $config->driver,
            'host' => $config->host,
            'port' => $config->port,
            'from_address' => $config->from_address,
            'from_name' => $config->from_name,
            'source' => 'database',
        ];
    }
}
