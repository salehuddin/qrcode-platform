<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class UserPreferencesController extends Controller
{
    /**
     * Display the user's preferences form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $settings = $user->settings ?? [
            'theme' => 'system',
            'font_size' => 'normal',
            'compact_mode' => false,
            'default_date_range' => '30days'
        ];

        return Inertia::render('Settings/Preferences', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the user's preferences.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|in:light,dark,system',
            'font_size' => 'required|in:small,normal,large',
            'compact_mode' => 'required|boolean',
            'default_date_range' => 'required|in:7days,30days,month,year',
        ]);

        $request->user()->update([
            'settings' => $validated,
        ]);

        return Redirect::route('preferences.edit')->with('success', 'Preferences updated successfully.');
    }
}

