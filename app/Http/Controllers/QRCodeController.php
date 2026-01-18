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

    public function edit(QrCode $qrCode)
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
        ]);
    }

    public function update(Request $request, QrCode $qrCode)
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
        ]);

        $qrCode->update($validated);

        if (isset($validated['tags'])) {
            $qrCode->tags()->sync($validated['tags']);
        }

        return redirect()->route('qr-codes.show', $qrCode->id);
    }

    public function destroy(QrCode $qrCode)
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
    public function analytics(QrCode $qrCode)
    {
        $user = Auth::user();
        $organization = $user->currentOrganization();

        if ($qrCode->user_id !== $user->id) {
            if (!$organization || !$user->canViewAllQrCodes($organization)) {
                abort(403);
            }
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

        $query = QrCode::whereIn('id', $request->ids);
        
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

        $query = QrCode::whereIn('id', $request->ids);
        
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
    public function toggleStatus(QrCode $qrCode)
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
        $qrCode = QrCode::onlyTrashed()->findOrFail($id);
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
        $qrCode = QrCode::onlyTrashed()->findOrFail($id);
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
    public function download(Request $request, QrCode $qrCode)
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
