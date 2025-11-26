import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import type { PageProps, QRCode, ScanEvent } from '@/types';

interface TimeSeriesPoint {
    label: string;
    value: number;
}

interface CategoryBreakdown {
    label: string;
    value: number;
    percent: number;
}

interface ReferrerStat {
    source: string;
    scans: number;
    percent: number;
}

interface QRCodeAnalyticsProps extends PageProps {
    qrcode: QRCode;
    scansOverTime: TimeSeriesPoint[];
    deviceBreakdown: CategoryBreakdown[];
    locationBreakdown: CategoryBreakdown[];
    referrers: ReferrerStat[];
    recentScans: ScanEvent[];
    peakHours: TimeSeriesPoint[];
}

export default function QRCodeAnalytics({
    qrcode,
    scansOverTime,
    deviceBreakdown,
    locationBreakdown,
    referrers,
    recentScans,
    peakHours,
}: QRCodeAnalyticsProps) {
    const maxTimelineValue = Math.max(...scansOverTime.map((p) => p.value), 1);
    const maxPeakHourValue = Math.max(...peakHours.map((p) => p.value), 1);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Analytics for {qrcode.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Detailed scan analytics for this QR code
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={qrcode.is_active ? 'default' : 'secondary'}>
                            {qrcode.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="outline" asChild>
                            <Link href={`/qr-codes/${qrcode.id}`}>
                                View QR Details
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`Analytics: ${qrcode.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* Summary cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{qrcode.scan_count}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Unique Scans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{qrcode.unique_scans}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Last Scanned</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm">
                                    {qrcode.last_scanned_at
                                        ? new Date(qrcode.last_scanned_at).toLocaleString()
                                        : 'Never'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Scan timeline */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Scan Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex h-40 items-end gap-2">
                                        {scansOverTime.map((point) => (
                                            <div
                                                key={point.label}
                                                className="flex flex-1 flex-col items-center gap-1"
                                            >
                                                <div
                                                    className="w-full rounded-t bg-primary/70"
                                                    style={{
                                                        height: `${(point.value / maxTimelineValue) * 100}%`,
                                                    }}
                                                />
                                                <span className="text-[10px] text-muted-foreground">
                                                    {point.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Peak hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Peak Scanning Times</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {peakHours.map((hour) => {
                                    const percent = Math.round(
                                        (hour.value / maxPeakHourValue) * 100,
                                    );

                                    return (
                                        <div key={hour.label} className="space-y-1 text-xs">
                                            <div className="flex items-center justify-between">
                                                <span>{hour.label}</span>
                                                <span className="text-muted-foreground">
                                                    {hour.value} scans
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-muted">
                                                <div
                                                    className="h-1.5 rounded-full bg-emerald-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                {peakHours.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No scan activity yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Device breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Devices</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {deviceBreakdown.map((d) => (
                                    <div
                                        key={d.label}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{d.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-1.5 rounded-full bg-primary"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {d.value} ({d.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {deviceBreakdown.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No device data yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Location breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Locations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {locationBreakdown.map((loc) => (
                                    <div
                                        key={loc.label}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{loc.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-1.5 rounded-full bg-blue-500"
                                                    style={{ width: `${loc.percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {loc.value} ({loc.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {locationBreakdown.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No location data yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Referrers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Referrers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {referrers.map((ref) => (
                                    <div
                                        key={ref.source}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{ref.source}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {ref.scans} scans ({ref.percent}%)
                                        </span>
                                    </div>
                                ))}
                                {referrers.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No referrer data yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent scans table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Scans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentScans.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No scans recorded yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                        <thead>
                                            <tr className="border-b text-left text-[11px] uppercase text-muted-foreground">
                                                <th className="py-2 pr-4">Time</th>
                                                <th className="py-2 pr-4">Device</th>
                                                <th className="py-2 pr-4">Browser / OS</th>
                                                <th className="py-2 pr-4">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentScans.map((scan) => (
                                                <tr key={scan.id} className="border-b last:border-0">
                                                    <td className="py-2 pr-4">
                                                        {new Date(scan.scanned_at).toLocaleString()}
                                                    </td>
                                                    <td className="py-2 pr-4">
                                                        {scan.device_type}
                                                    </td>
                                                    <td className="py-2 pr-4">
                                                        {scan.browser} / {scan.os}
                                                    </td>
                                                    <td className="py-2 pr-4">
                                                        {scan.city && scan.country
                                                            ? `${scan.city}, ${scan.country}`
                                                            : scan.country || 'Unknown'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Export action */}
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="#">Export CSV (mock)</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
