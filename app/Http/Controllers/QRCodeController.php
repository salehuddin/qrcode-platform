<?php

namespace App\Http\Controllers;

use App\Models\QRCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QRCodeController extends Controller
{
    public function __construct(
        protected \App\Services\FolderService $folderService,
        protected \App\Services\TagService $tagService
    ) {}

    public function index(Request $request)
    {
        $view = $request->get('view', 'active');
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($organization && $user->canViewAllQrCodes($organization)) {
            $query = $organization->qrCodes()->with(['folder', 'tags', 'user']);
        } else {
            $query = $user->qrCodes()->with(['folder', 'tags', 'user']);
        }

        // Handle different views
        if ($view === 'trash') {
            $query->onlyTrashed();
        }
        // Both 'active' and 'all' views show only non-deleted items (default behavior)

        $query->latest();

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
            'view' => $view,
        ]);
    }

    public function create()
    {
        $organization = Auth::user()->currentOrganization();

        return Inertia::render('QRCode/Create', [
            'folders' => $organization ? $this->folderService->getFolderTree($organization) : [],
            'tags' => $organization ? $this->tagService->getTags($organization) : [],
            'brandKits' => $organization ? \App\Models\BrandKit::where('organization_id', $organization->id)->get() : [],
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

        return redirect()->route('qr-codes.show', $qrCode->id)->with('success', 'QR Code created successfully!');
    }

    public function show(QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        // Check permissions: Admins/Editors can view all, others view own
        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canViewAllQrCodes($organization)) {
                abort(403, 'You do not have permission to view this QR code.');
            }
        }

        $qrCode->load(['folder', 'tags', 'user']);
        
        // Fetch activities with causer
        $activities = $qrCode->activities()
            ->with('causer')
            ->latest()
            ->get();

        return Inertia::render('QRCode/Show', [
            'qrCode' => $qrCode,
            'activities' => $activities,
            'folders' => $organization ? $this->folderService->getFolderTree($organization) : [],
            'tags' => $organization ? $this->tagService->getTags($organization) : [],
        ]);
    }

    public function edit(QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canEditAllQrCodes($organization)) {
                abort(403);
            }
        }

        $organization = Auth::user()->currentOrganization();
        $qrCode->load(['tags']);

        return Inertia::render('QRCode/Edit', [
            'qrCode' => $qrCode,
            'folders' => $organization ? $this->folderService->getFolderTree($organization) : [],
            'tags' => $organization ? $this->tagService->getTags($organization) : [],
            'brandKits' => $organization ? \App\Models\BrandKit::where('organization_id', $organization->id)->get() : [],
        ]);
    }

    public function update(Request $request, QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        // Check permissions: Owner/Admin can edit all, Editor can edit own, others edit own
        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canEditAllQrCodes($organization)) {
                abort(403, 'You do not have permission to edit this QR code.');
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination_url' => 'required|url',
            'folder_id' => 'nullable|exists:folders,id',
            'is_active' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'design' => 'nullable|array',
            'customization' => 'nullable|array',
            'permalink' => 'nullable|string|unique:qr_codes,permalink,' . $qrCode->id,
        ]);

        $qrCode->update($validated);

        if (isset($validated['tags'])) {
            $qrCode->tags()->sync($validated['tags']);
        }

        return redirect()->route('qr-codes.show', $qrCode->id)->with('success', 'QR Code updated successfully!');
    }

    public function destroy(QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canEditAllQrCodes($organization)) {
                abort(403, 'You do not have permission to delete this QR code.');
            }
        }

        $qrCode->delete();

        return redirect()->route('qr-codes.index')
            ->with('success', 'QR Code moved to trash.');
    }

    /**
     * Show analytics for a specific QR code.
     */
    public function analytics(Request $request, QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canViewAllQrCodes($organization)) {
                abort(403);
            }
        }
        
        $startDate = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date')) : \Carbon\Carbon::now()->subDays(29);
        $endDate = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date')) : \Carbon\Carbon::now();
        $days = $startDate->diffInDays($endDate) + 1; // Approximate for now, or pass dates directly if service supports it

        $analyticsService = new \App\Services\AnalyticsService();

        // Pass dates to service methods if they support it, or modify service to support it. 
        // For now, assuming service uses 'days' or we need to update service too.
        // Let's assume we need to update service or pass a date range.
        // The current service likely takes $days. We should check AnalyticsService.php.
        // But for now, let's pass the raw values to view and let service handle default 'days' if implied.
        // Actually, to fully support date range in individual analytics, I should update AnalyticsService signatures or use a different approach.
        // For this step, I will stick to what QrCodeController passes.
        
        return Inertia::render('Analytics/QRCodeAnalytics', [
            'qrcode' => $qrCode,
            'scansOverTime' => $analyticsService->getScansOverTime($qrCode, $startDate, $endDate),
            'deviceBreakdown' => $analyticsService->getDeviceBreakdown($qrCode, $startDate, $endDate),
            'locationBreakdown' => $analyticsService->getLocationBreakdown($qrCode, 4, $startDate, $endDate),
            'referrers' => $analyticsService->getReferrers($qrCode, $startDate, $endDate),
            'peakHours' => $analyticsService->getPeakHours($qrCode, $startDate, $endDate),
            'recentScans' => $analyticsService->getRecentScans($qrCode), // Recent scans usually just list latest, but maybe could filter too. Leaving as is for log.
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
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

        $query = QRCode::whereIn('id', $request->ids);
        
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization || !$user->canEditAllQrCodes($organization)) {
            $query->where('user_id', $user->id);
        }

        $qrCodes = $query->get();

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

        $query = QRCode::whereIn('id', $request->ids);
        
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if (!$organization || !$user->canEditAllQrCodes($organization)) {
            $query->where('user_id', $user->id);
        }

        $qrCodes = $query->get();

        foreach ($qrCodes as $qrCode) {
            $qrCode->tags()->sync($request->tag_ids);
        }

        return redirect()->back()->with('success', 'Tags updated successfully.');
    }

    /**
     * Toggle the active status of a QR code (dynamic only).
     */
    public function toggleStatus(QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canEditAllQrCodes($organization)) {
                abort(403);
            }
        }

        if ($qrCode->mode !== 'dynamic') {
            return back()->with('error', 'Only dynamic QR codes can have their status toggled.');
        }

        $qrCode->update(['is_active' => !$qrCode->is_active]);

        return back()->with('success', 'QR code status updated.');
    }

    /**
     * Restore a soft-deleted QR code.
     */
    public function restore($id)
    {
        $qrCode = QRCode::onlyTrashed()->findOrFail($id);
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canEditAllQrCodes($organization)) {
                abort(403);
            }
        }

        $qrCode->restore();

        return back()->with('success', 'QR code restored successfully.');
    }

    /**
     * Permanently delete a QR code.
     */
    public function forceDelete($id)
    {
        $qrCode = QRCode::onlyTrashed()->findOrFail($id);
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canEditAllQrCodes($organization)) {
                abort(403);
            }
        }

        $qrCode->forceDelete();

        return back()->with('success', 'QR code permanently deleted.');
    }
    /**
     * Download the QR code in a specific format.
     */
    public function download(Request $request, QRCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canViewAllQrCodes($organization)) {
                abort(403);
            }
        }

        $format = $request->input('format', 'png');
        $allowedFormats = ['png', 'svg', 'pdf', 'eps'];

        if (!in_array($format, $allowedFormats)) {
            abort(400, 'Invalid format');
        }

        $builder = new \Endroid\QrCode\Builder\Builder(
            writer: match ($format) {
                'svg' => new \Endroid\QrCode\Writer\SvgWriter(),
                'pdf' => new \Endroid\QrCode\Writer\PdfWriter(),
                'eps' => new \Endroid\QrCode\Writer\EpsWriter(),
                default => new \Endroid\QrCode\Writer\PngWriter(),
            },
            writerOptions: [],
            validateResult: false,
            data: $qrCode->content,
            encoding: new \Endroid\QrCode\Encoding\Encoding('UTF-8'),
            errorCorrectionLevel: match (($qrCode->design['error_correction'] ?? 'M')) {
                'L' => \Endroid\QrCode\ErrorCorrectionLevel::Low,
                'Q' => \Endroid\QrCode\ErrorCorrectionLevel::Quartile,
                'H' => \Endroid\QrCode\ErrorCorrectionLevel::High,
                default => \Endroid\QrCode\ErrorCorrectionLevel::Medium,
            },
            size: 300,
            margin: 10,
            roundBlockSizeMode: \Endroid\QrCode\RoundBlockSizeMode::Margin,
            // logoPath: $logoPath, // TODO: Add logo support if needed from design
            // labelText: 'Scan me', // Optional
        );

        $result = $builder->build();
        
        $headers = [
            'Content-Type' => $result->getMimeType(),
            'Content-Disposition' => 'attachment; filename="' . $qrCode->name . '.' . $format . '"',
        ];

        return response($result->getString(), 200, $headers);
    }
}
