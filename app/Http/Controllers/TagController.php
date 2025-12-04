<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(
        protected TagService $tagService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        return Inertia::render('Tags/Index', [
            'tags' => $this->tagService->getTags($organization),
            'can' => [
                'create' => $request->user()->can('create', [Tag::class, $organization]),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('create', [Tag::class, $organization]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $this->tagService->createTag($organization, $validated);

        return back()->with('success', 'Tag created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        Gate::authorize('update', $tag);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $this->tagService->updateTag($tag, $validated);

        return back()->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        Gate::authorize('delete', $tag);

        $this->tagService->deleteTag($tag);

        return back()->with('success', 'Tag deleted successfully.');
    }
}
