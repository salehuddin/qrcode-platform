<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::latest()->get();

        return Inertia::render('Admin/Templates', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
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

        return back()->with('success', 'Template created successfully.');
    }

    public function destroy($id)
    {
        $template = Template::findOrFail($id);
        $template->delete();

        return back()->with('success', 'Template deleted successfully.');
    }
}
