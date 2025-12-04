<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QrCodeController extends Controller
{
    public function __construct(
        protected \App\Services\FolderService $folderService,
        protected \App\Services\TagService $tagService
    ) {}

    public function index(Request $request)
    {
        $query = Auth::user()->qrCodes()->with(['folder', 'tags'])->latest();

        if ($request->has('folder_id')) {
            $query->where('folder_id', $request->folder_id);
        }

        if ($request->has('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }

        $qrCodes = $query->get();
        $organization = Auth::user()->currentOrganization();

        return Inertia::render('QRCode/Index', [
            'qrCodes' => $qrCodes,
            'folders' => $organization ? $this->folderService->getFolderTree($organization) : [],
            'tags' => $organization ? $this->tagService->getTags($organization) : [],
            'filters' => $request->only(['folder_id', 'tag_id']),
        ]);
    }

    public function create()
    {
        $organization = Auth::user()->currentOrganization();

        return Inertia::render('QRCode/Create', [
            'folders' => $organization ? $this->folderService->getFolderTree($organization) : [],
            'tags' => $organization ? $this->tagService->getTags($organization) : [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|string',
            'mode' => 'required|in:static,dynamic',
            'content' => 'required|string',
            'permalink' => 'nullable|string|unique:qr_codes,permalink',
            'destination_url' => 'nullable|url',
            'design' => 'nullable|array',
            'customization' => 'nullable|array',
            'folder_id' => 'nullable|exists:folders,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $organization = Auth::user()->currentOrganization();
        
        // Add organization_id to creation data
        $data = $validated;
        $data['organization_id'] = $organization ? $organization->id : null; // Should handle no org case if needed

        $qrCode = Auth::user()->qrCodes()->create($data);

        if (isset($validated['tags'])) {
            $qrCode->tags()->sync($validated['tags']);
        }

        return redirect()->route('qr-codes.show', $qrCode->id);
    }

    public function show(QrCode $qrCode)
    {
        // Ensure user owns the QR code (or has permission via org)
        // For now, simple ownership check, but should use Policy
        if ($qrCode->user_id !== Auth::id()) {
             // Check org permission if needed
             // Gate::authorize('view', $qrCode);
        }

        $qrCode->load(['folder', 'tags']);

        return Inertia::render('QRCode/Show', [
            'qrCode' => $qrCode
        ]);
    }

    public function edit(QrCode $qrCode)
    {
        if ($qrCode->user_id !== Auth::id()) {
            abort(403);
        }

        $organization = Auth::user()->currentOrganization();
        $qrCode->load(['tags']);

        return Inertia::render('QRCode/Edit', [
            'qrCode' => $qrCode,
            'folders' => $organization ? $this->folderService->getFolderTree($organization) : [],
            'tags' => $organization ? $this->tagService->getTags($organization) : [],
        ]);
    }

    public function update(Request $request, QrCode $qrCode)
    {
        if ($qrCode->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'destination_url' => 'nullable|url',
            'design' => 'nullable|array',
            'customization' => 'nullable|array',
            'folder_id' => 'nullable|exists:folders,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $qrCode->update($validated);

        if (isset($validated['tags'])) {
            $qrCode->tags()->sync($validated['tags']);
        }

        return redirect()->route('qr-codes.show', $qrCode->id);
    }

    public function destroy(QrCode $qrCode)
    {
        if ($qrCode->user_id !== Auth::id()) {
            abort(403);
        }

        $qrCode->delete();

        return redirect()->route('qr-codes.index');
    }

    /**
     * Show analytics for a specific QR code.
     */
    public function analytics(QrCode $qrCode)
    {
        if ($qrCode->user_id !== Auth::id()) {
            abort(403);
        }

        $analyticsService = new \App\Services\AnalyticsService();

        return Inertia::render('Analytics/QRCodeAnalytics', [
            'qrcode' => $qrCode,
            'scansOverTime' => $analyticsService->getScansOverTime($qrCode),
            'deviceBreakdown' => $analyticsService->getDeviceBreakdown($qrCode),
            'locationBreakdown' => $analyticsService->getLocationBreakdown($qrCode),
            'referrers' => $analyticsService->getReferrers($qrCode),
            'peakHours' => $analyticsService->getPeakHours($qrCode),
            'recentScans' => $analyticsService->getRecentScans($qrCode),
        ]);
    }

    /**
     * Bulk move QR codes to a folder.
     */
    public function bulkMove(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required', // Allow string or integer
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $qrCodes = QrCode::whereIn('id', $request->ids)
            ->where('user_id', Auth::id())
            ->get();

        foreach ($qrCodes as $qrCode) {
            $qrCode->update(['folder_id' => $request->folder_id]);
        }

        return redirect()->back()->with('success', 'QR codes moved successfully.');
    }

    /**
     * Bulk update tags for QR codes.
     */
    public function bulkUpdateTags(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required', // Allow string or integer
            'tag_ids' => 'required|array',
            'tag_ids.*' => 'required|integer|exists:tags,id',
        ]);

        $qrCodes = QrCode::whereIn('id', $request->ids)
            ->where('user_id', Auth::id())
            ->get();

        foreach ($qrCodes as $qrCode) {
            $qrCode->tags()->sync($request->tag_ids);
        }

        return redirect()->back()->with('success', 'Tags updated successfully.');
    }
}
