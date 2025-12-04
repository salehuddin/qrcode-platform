<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Organization;
use App\Services\FolderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FolderController extends Controller
{
    public function __construct(
        protected FolderService $folderService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        return Inertia::render('Folders/Index', [
            'folders' => $this->folderService->getFolderTree($organization),
            'can' => [
                'create' => $request->user()->can('create', [Folder::class, $organization]),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $organization = Organization::findOrFail($request->session()->get('organization_id'));

        Gate::authorize('create', [Folder::class, $organization]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:folders,id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        $this->folderService->createFolder($organization, $validated);

        return back()->with('success', 'Folder created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        Gate::authorize('update', $folder);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        $this->folderService->updateFolder($folder, $validated);

        return back()->with('success', 'Folder updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        Gate::authorize('delete', $folder);

        $this->folderService->deleteFolder($folder);

        return back()->with('success', 'Folder deleted successfully.');
    }

    /**
     * Move folder to a new parent.
     */
    public function move(Request $request, Folder $folder)
    {
        Gate::authorize('update', $folder);

        $validated = $request->validate([
            'parent_id' => 'nullable|exists:folders,id',
        ]);

        $newParent = $validated['parent_id'] ? Folder::find($validated['parent_id']) : null;

        try {
            $this->folderService->moveFolder($folder, $newParent);
            return back()->with('success', 'Folder moved successfully.');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['parent_id' => $e->getMessage()]);
        }
    }
}
