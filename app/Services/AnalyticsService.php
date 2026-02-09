<?php

namespace App\Services;

use App\Models\QRCode;
use App\Models\QrScan;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get scans over time for the last 7 days.
     */
    /**
     * Get scans over time for a date range.
     */
    public function getScansOverTime(QRCode $qrCode, $startDate = null, $endDate = null): array
    {
        $start = $startDate ? \Carbon\Carbon::parse($startDate) : now()->subDays(29);
        $end = $endDate ? \Carbon\Carbon::parse($endDate) : now();

        $scans = $qrCode->scans()
            ->whereBetween('scanned_at', [$start->startOfDay(), $end->endOfDay()])
            ->selectRaw('DATE(scanned_at) as date, COUNT(*) as count')
            ->groupBy(\Illuminate\Support\Facades\DB::raw('DATE(scanned_at)'))
            ->orderBy('date')
            ->get();

        // Fill in missing dates
        $result = [];
        $period = \Carbon\CarbonPeriod::create($start, $end);

        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $isoDate = $date->format('Y-m-d'); // Keep distinct if needed, but here simple format matches DB
            
            $scan = $scans->firstWhere('date', $dateString);
            $result[] = [
                'label' => $date->format('M j'),
                'value' => $scan ? $scan->count : 0,
            ];
        }

        return $result;
    }

    /**
     * Get device breakdown.
     */
    public function getDeviceBreakdown(QRCode $qrCode, $startDate = null, $endDate = null): array
    {
        $query = $qrCode->scans();
        
        if ($startDate && $endDate) {
            $query->whereBetween('scanned_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(), 
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        }
        
        $total = (clone $query)->count();
        if ($total === 0) {
            return [];
        }

        $devices = $query
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->groupBy('device_type')
            ->get();

        return $devices->map(function ($device) use ($total) {
            return [
                'label' => $device->device_type ?? 'Unknown',
                'value' => $device->count,
                'percent' => round(($device->count / $total) * 100),
            ];
        })->toArray();
    }

    /**
     * Get location breakdown.
     */
    public function getLocationBreakdown(QRCode $qrCode, int $limit = 4, $startDate = null, $endDate = null): array
    {
        $query = $qrCode->scans()->whereNotNull('country');

        if ($startDate && $endDate) {
            $query->whereBetween('scanned_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(), 
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $total = (clone $query)->count();
        if ($total === 0) {
            return [];
        }

        $locations = $query
            ->select('country', DB::raw('COUNT(*) as count'))
            ->groupBy('country')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();

        return $locations->map(function ($location) use ($total) {
            return [
                'label' => $location->country,
                'value' => $location->count,
                'percent' => round(($location->count / $total) * 100),
            ];
        })->toArray();
    }

    /**
     * Get referrer statistics.
     */
    public function getReferrers(QRCode $qrCode, $startDate = null, $endDate = null): array
    {
        $query = $qrCode->scans();

        if ($startDate && $endDate) {
            $query->whereBetween('scanned_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(), 
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $total = (clone $query)->count();
        if ($total === 0) {
            return [];
        }

        $referrers = $query
            ->select(
                DB::raw('CASE 
                    WHEN referrer IS NULL OR referrer = "" THEN "Direct / QR" 
                    ELSE referrer 
                END as source'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('source')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return $referrers->map(function ($ref) use ($total) {
            return [
                'source' => $ref->source,
                'scans' => $ref->count,
                'percent' => round(($ref->count / $total) * 100),
            ];
        })->toArray();
    }

    /**
     * Get peak scanning hours.
     */
    public function getPeakHours(QRCode $qrCode, $startDate = null, $endDate = null): array
    {
        $query = $qrCode->scans();

        if ($startDate && $endDate) {
            $query->whereBetween('scanned_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(), 
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $scans = $query
            ->select(
                DB::raw('HOUR(scanned_at) as hour'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // Group into time ranges
        $ranges = [
            '00:00 - 06:00' => 0,
            '06:00 - 12:00' => 0,
            '12:00 - 18:00' => 0,
            '18:00 - 24:00' => 0,
        ];

        foreach ($scans as $scan) {
            $hour = $scan->hour;
            if ($hour >= 0 && $hour < 6) {
                $ranges['00:00 - 06:00'] += $scan->count;
            } elseif ($hour >= 6 && $hour < 12) {
                $ranges['06:00 - 12:00'] += $scan->count;
            } elseif ($hour >= 12 && $hour < 18) {
                $ranges['12:00 - 18:00'] += $scan->count;
            } else {
                $ranges['18:00 - 24:00'] += $scan->count;
            }
        }

        return collect($ranges)->map(function ($value, $label) {
            return [
                'label' => $label,
                'value' => $value,
            ];
        })->values()->toArray();
    }

    /**
     * Get recent scans.
     */
    public function getRecentScans(QRCode $qrCode, int $limit = 10): array
    {
        return $qrCode->scans()
            ->orderByDesc('scanned_at')
            ->limit($limit)
            ->get()
            ->map(function ($scan) {
                return [
                    'id' => $scan->id,
                    'qr_code_id' => $scan->qr_code_id,
                    'ip_address' => $scan->ip_address,
                    'user_agent' => $scan->user_agent,
                    'device_type' => $scan->device_type,
                    'browser' => $scan->browser,
                    'os' => $scan->os,
                    'country' => $scan->country ?? 'Unknown',
                    'city' => $scan->city,
                    'scanned_at' => $scan->scanned_at->toDateTimeString(),
                ];
            })
            ->toArray();
    }
}
