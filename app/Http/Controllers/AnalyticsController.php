<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QRCode;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $organization = Auth::user()->currentOrganization();
        
        if (!$organization) {
            return Inertia::render('Analytics/Dashboard', [
                'summary' => [
                    'total_scans' => 0,
                    'unique_scanners' => 0,
                    'scans_this_month' => 0,
                    'active_qr_codes' => 0,
                ],
                'scansOverTime' => [],
                'deviceBreakdown' => [],
                'osBreakdown' => [],
                'topQrCodes' => [],
                'filters' => [
                    'start_date' => $request->input('start_date', Carbon::now()->subDays(29)->format('Y-m-d')),
                    'end_date' => $request->input('end_date', Carbon::now()->format('Y-m-d')),
                    'qr_code_id' => $request->input('qr_code_id'),
                ],
                'qrCodes' => [], 
            ]);
        }

        // Filters
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : Carbon::now()->subDays(29);
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : Carbon::now();
        $qrCodeId = $request->input('qr_code_id');

        // Base query for scans
        $scansQuery = DB::table('qr_scans')
            ->join('qr_codes', 'qr_scans.qr_code_id', '=', 'qr_codes.id')
            ->where('qr_codes.organization_id', $organization->id);

        if ($qrCodeId) {
            $scansQuery->where('qr_codes.id', $qrCodeId);
        }
        
        // Date range filter for charts/metrics (except total active QR codes)
        $filteredScansQuery = (clone $scansQuery)
            ->whereBetween('qr_scans.scanned_at', [$startDate->startOfDay(), $endDate->endOfDay()]);

        // 1. Summary Stats
        $totalScans = (clone $filteredScansQuery)->count();
        $uniqueScanners = (clone $filteredScansQuery)->distinct('ip_address')->count('ip_address');
        $scansThisMonth = (clone $scansQuery)
            ->where('qr_scans.scanned_at', '>=', Carbon::now()->startOfMonth())
            ->where(function($q) use ($qrCodeId) {
                 if ($qrCodeId) $q->where('qr_codes.id', $qrCodeId);
            })
            ->count();
            
        $activeQrCodesQuery = QRCode::where('organization_id', $organization->id)
            ->where('is_active', true);
        if ($qrCodeId) {
            $activeQrCodesQuery->where('id', $qrCodeId);
        }
        $activeQrCodes = $activeQrCodesQuery->count();

        // 2. Scans Over Time
        $scansOverTimeData = (clone $filteredScansQuery)
            ->selectRaw('DATE(qr_scans.scanned_at) as date, COUNT(*) as count')
            ->groupBy(\Illuminate\Support\Facades\DB::raw('DATE(qr_scans.scanned_at)'))
            ->orderBy('date')
            ->get();
            
        // Fill in missing dates
        $scansOverTime = [];
        $period = CarbonPeriod::create($startDate, $endDate);
        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $record = $scansOverTimeData->firstWhere('date', $dateString);
            $scansOverTime[] = [
                'label' => $date->format('M j'),
                'value' => $record ? $record->count : 0,
            ];
        }

        // 3. Device Breakdown
        $deviceBreakdownData = (clone $filteredScansQuery)
            ->select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get();
            
        $deviceBreakdown = $deviceBreakdownData->map(function($item) use ($totalScans) {
            return [
                'label' => $item->device_type ?: 'Unknown',
                'value' => $item->count,
                'percent' => $totalScans > 0 ? round(($item->count / $totalScans) * 100) : 0,
            ];
        });

        // 4. OS Breakdown
        $osBreakdownData = (clone $filteredScansQuery)
            ->select('os', DB::raw('count(*) as count'))
            ->groupBy('os')
            ->orderByDesc('count')
            ->limit(5)
            ->get();
            
        $osBreakdown = $osBreakdownData->map(function($item) use ($totalScans) {
            return [
                'label' => $item->os ?: 'Unknown',
                'value' => $item->count,
                'percent' => $totalScans > 0 ? round(($item->count / $totalScans) * 100) : 0,
            ];
        });

        // 5. Top QR Codes (skip if filtered by single QR)
        $topQrCodes = collect([]);
        if (!$qrCodeId) {
            $topQrCodes = QRCode::where('organization_id', $organization->id)
                ->withCount(['scans' => function($q) use ($startDate, $endDate) {
                    $q->whereBetween('scanned_at', [$startDate->startOfDay(), $endDate->endOfDay()]);
                }])
                ->orderByDesc('scans_count')
                ->limit(5)
                ->get();
        }

        // Get list of QR codes for filter dropdown
        $qrCodesList = QRCode::where('organization_id', $organization->id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Analytics/Dashboard', [
            'summary' => [
                'total_scans' => $totalScans,
                'unique_scanners' => $uniqueScanners,
                'scans_this_month' => $scansThisMonth,
                'active_qr_codes' => $activeQrCodes,
            ],
            'scansOverTime' => $scansOverTime,
            'deviceBreakdown' => $deviceBreakdown,
            'osBreakdown' => $osBreakdown,
            'topQrCodes' => $topQrCodes,
            'qrCodes' => $qrCodesList,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'qr_code_id' => $qrCodeId,
            ],
        ]);
    }

    public function export(Request $request) 
    {
        $organization = Auth::user()->currentOrganization();
        if (!$organization) abort(403);

        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : Carbon::now()->subDays(29);
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : Carbon::now();
        $qrCodeId = $request->input('qr_code_id');

        $fileName = 'analytics_export_' . Carbon::now()->format('Y-m-d_H-i-s') . '.csv';

        $scansQuery = DB::table('qr_scans')
            ->join('qr_codes', 'qr_scans.qr_code_id', '=', 'qr_codes.id')
            ->where('qr_codes.organization_id', $organization->id)
            ->whereBetween('qr_scans.scanned_at', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->select(
                'qr_scans.scanned_at',
                'qr_codes.name as qr_name',
                'qr_scans.ip_address',
                'qr_scans.device_type',
                'qr_scans.os',
                'qr_scans.browser',
                'qr_scans.country',
                'qr_scans.city',
                'qr_scans.referrer'
            );

        if ($qrCodeId) {
            $scansQuery->where('qr_codes.id', $qrCodeId);
        }

        return response()->streamDownload(function () use ($scansQuery) {
            $handle = fopen('php://output', 'w');
            
            // Header
            fputcsv($handle, ['Timestamp', 'QR Name', 'IP Address', 'Device', 'OS', 'Browser', 'Country', 'City', 'Referrer']);

            $scansQuery->orderBy('qr_scans.scanned_at', 'desc')->chunk(1000, function ($rows) use ($handle) {
                foreach ($rows as $row) {
                    fputcsv($handle, [
                        $row->scanned_at,
                        $row->qr_name,
                        $row->ip_address,
                        $row->device_type,
                        $row->os,
                        $row->browser,
                        $row->country,
                        $row->city,
                        $row->referrer
                    ]);
                }
            });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
