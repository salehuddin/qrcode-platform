<?php

namespace App\Http\Controllers;

use App\Models\BrandKit;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DesignController extends Controller
{
    public function index()
    {
        $organization = Auth::user()->currentOrganization();

        return Inertia::render('Design/Index', [
            'templates' => Template::where('is_public', true)->get(),
            'brandKits' => $organization ? BrandKit::where('organization_id', $organization->id)->get() : [],
            'isAdmin' => Auth::user()->email === 'admin@example.com', // TODO: Replace with proper admin check
        ]);
    }

    public function storeBrandKit(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'config' => 'required|array',
        ]);

        $organization = Auth::user()->currentOrganization();

        if (!$organization) {
            return back()->withErrors(['organization' => 'No active organization found.']);
        }

        BrandKit::create([
            'organization_id' => $organization->id,
            'name' => $request->name,
            'config' => $request->config,
            'is_default' => false,
        ]);

        return back()->with('success', 'Brand kit saved successfully.');
    }

    public function storeTemplate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'config' => 'required|array',
        ]);

        Template::create([
            'name' => $request->name,
            'category' => $request->category,
            'config' => $request->config,
            'is_public' => true,
        ]);

        return redirect()->route('admin.templates')->with('success', 'Template created successfully.');
    }

    public function deleteBrandKit($id)
    {
        $organization = Auth::user()->currentOrganization();
        
        $brandKit = BrandKit::where('organization_id', $organization->id)
            ->where('id', $id)
            ->firstOrFail();

        $brandKit->delete();

        return back()->with('success', 'Brand kit deleted successfully.');
    }
}
