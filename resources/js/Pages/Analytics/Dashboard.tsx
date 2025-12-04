import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import type { PageProps, QRCode } from '@/types';

interface TimeSeriesPoint {
    label: string;
    value: number;
}

interface CategoryBreakdown {
    label: string;
    value: number;
    percent: number;
}

interface AnalyticsSummary {
    total_scans: number;
    unique_scanners: number;
    scans_this_month: number;
    active_qr_codes: number;
}

interface AnalyticsDashboardProps extends PageProps {
    summary: AnalyticsSummary;
    scansOverTime: TimeSeriesPoint[];
    deviceBreakdown: CategoryBreakdown[];
    osBreakdown: CategoryBreakdown[];
    topQrCodes: QRCode[];
    conversionFunnel: TimeSeriesPoint[];
}

export default function AnalyticsDashboard({
    summary,
    scansOverTime,
    deviceBreakdown,
    osBreakdown,
    topQrCodes,
    conversionFunnel,
}: AnalyticsDashboardProps) {
    const maxScanValue = Math.max(...scansOverTime.map((p) => p.value), 1);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">
                            Analytics Dashboard
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Overview of scans, devices, and top performing QR codes
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Summary cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.total_scans}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Unique Scanners</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.unique_scanners}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.scans_this_month}</div>
                                <p className="text-xs text-muted-foreground">Scans in current month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.active_qr_codes}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Scans over time */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Scans Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-end gap-2 h-40">
                                        {scansOverTime.map((point) => (
                                            <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full rounded-t bg-primary/70"
                                                    style={{
                                                        height: `${(point.value / maxScanValue) * 100}%`,
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

                        {/* Conversion funnel */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Conversion Funnel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {conversionFunnel.map((step, index) => {
                                    const max = conversionFunnel[0]?.value || 1;
                                    const percent = Math.round((step.value / max) * 100);

                                    return (
                                        <div key={step.label} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium">{index + 1}. {step.label}</span>
                                                <span className="text-muted-foreground">{percent}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-muted">
                                                <div
                                                    className="h-2 rounded-full bg-emerald-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Device breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Devices</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {deviceBreakdown.map((d) => (
                                    <div key={d.label} className="flex items-center justify-between text-sm">
                                        <span>{d.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-primary rounded-full"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {d.value} ({d.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* OS breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Operating Systems</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {osBreakdown.map((d) => (
                                    <div key={d.label} className="flex items-center justify-between text-sm">
                                        <span>{d.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-blue-500 rounded-full"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {d.value} ({d.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Top performing QR codes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing QR Codes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {topQrCodes.map((qr) => (
                                    <div key={qr.id} className="flex items-center justify-between text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate max-w-[150px]">
                                                {qr.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase">
                                                {qr.type}
                                            </span>
                                        </div>
                                        <Badge variant="outline">{qr.scan_count} scans</Badge>
                                    </div>
                                ))}
                                {topQrCodes.length === 0 && (
                                    <p className="text-xs text-muted-foreground">No data yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Exports / actions */}
                    <div className="flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href="#">Export CSV (mock)</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
