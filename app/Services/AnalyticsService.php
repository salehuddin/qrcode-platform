<?php

namespace App\Services;

use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get scans over time for the last 7 days.
     */
    public function getScansOverTime(QrCode $qrCode, int $days = 7): array
    {
        $scans = $qrCode->scans()
            ->where('scanned_at', '>=', now()->subDays($days))
            ->select(DB::raw('DATE(scanned_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill in missing days with zero counts
        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayLabel = now()->subDays($i)->format('D');
            
            $scan = $scans->firstWhere('date', $date);
            $result[] = [
                'label' => $dayLabel,
                'value' => $scan ? $scan->count : 0,
            ];
        }

        return $result;
    }

    /**
     * Get device breakdown.
     */
    public function getDeviceBreakdown(QrCode $qrCode): array
    {
        $total = $qrCode->scans()->count();
        if ($total === 0) {
            return [];
        }

        $devices = $qrCode->scans()
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
    public function getLocationBreakdown(QrCode $qrCode, int $limit = 4): array
    {
        $total = $qrCode->scans()->count();
        if ($total === 0) {
            return [];
        }

        $locations = $qrCode->scans()
            ->whereNotNull('country')
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
    public function getReferrers(QrCode $qrCode): array
    {
        $total = $qrCode->scans()->count();
        if ($total === 0) {
            return [];
        }

        $referrers = $qrCode->scans()
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
    public function getPeakHours(QrCode $qrCode): array
    {
        $scans = $qrCode->scans()
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
    public function getRecentScans(QrCode $qrCode, int $limit = 10): array
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
