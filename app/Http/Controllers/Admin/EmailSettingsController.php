<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\EmailConfigService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailSettingsController extends Controller
{
    public function __construct(
        private EmailConfigService $emailConfigService
    ) {}

    /**
     * Display email settings page
     */
    public function index()
    {
        $config = $this->emailConfigService->getActiveConfig();
        $status = $this->emailConfigService->getConfigStatus();

        return Inertia::render('Admin/EmailSettings', [
            'currentConfig' => $config,
            'configStatus' => $status,
        ]);
    }

    /**
     * Update email configuration
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'driver' => 'required|in:smtp,sendgrid,mailgun,ses,log',
            'host' => 'nullable|string',
            'port' => 'nullable|integer',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'encryption' => 'nullable|in:tls,ssl,null',
            'from_address' => 'required|email',
            'from_name' => 'required|string',
        ]);

        try {
            $this->emailConfigService->updateEmailConfig($validated);

            return back()->with('success', 'Email settings updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update email settings: ' . $e->getMessage());
        }
    }

    /**
     * Test email connection
     */
    public function test(Request $request)
    {
        $validated = $request->validate([
            'test_email' => 'required|email',
        ]);

        try {
            $success = $this->emailConfigService->testEmailConnection($validated['test_email']);

            if ($success) {
                return back()->with('success', 'Test email sent successfully! Check your inbox.');
            } else {
                return back()->with('error', 'Failed to send test email. Please check your configuration.');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Test email failed: ' . $e->getMessage());
        }
    }
}
