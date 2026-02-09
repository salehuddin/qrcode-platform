import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import type { PageProps, QRCode, ScanEvent } from '@/types';
import { useState, useEffect } from 'react';
import { Download, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart"

const chartConfig = {
  scans: {
    label: "Scans",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

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
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function QRCodeAnalytics({
    qrcode,
    scansOverTime,
    deviceBreakdown,
    locationBreakdown,
    referrers,
    recentScans,
    peakHours,
    filters,
}: QRCodeAnalyticsProps) {
    const maxTimelineValue = Math.max(...scansOverTime.map((p) => p.value), 1);
    const maxPeakHourValue = Math.max(...peakHours.map((p) => p.value), 1);

    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    // Debounce filter application
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (startDate !== filters.start_date || endDate !== filters.end_date) {
                applyFilters();
            }
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [startDate, endDate]);

    const applyFilters = () => {
        router.get(
            route('qr-codes.analytics', qrcode.id),
            {
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handlePresetChange = (value: string) => {
        const end = new Date();
        let start = new Date();

        switch (value) {
            case '7days':
                start.setDate(end.getDate() - 7);
                break;
            case '30days':
                start.setDate(end.getDate() - 29); // 30 days inclusive
                break;
            case 'month':
                start = new Date(end.getFullYear(), end.getMonth(), 1);
                break;
            case 'year':
                start.setFullYear(end.getFullYear() - 1);
                break;
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const clearFilters = () => {
         const end = new Date();
         const start = new Date();
         start.setDate(end.getDate() - 29);
         
         setStartDate(start.toISOString().split('T')[0]);
         setEndDate(end.toISOString().split('T')[0]);
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            qr_code_id: qrcode.id.toString()
        });
        window.location.href = route('analytics.export') + '?' + params.toString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold leading-tight text-foreground">
                                Analytics for {qrcode.name}
                            </h2>
                            <Badge variant={qrcode.is_active ? 'default' : 'secondary'}>
                                {qrcode.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600">
                                Detailed scan analytics for this QR code
                            </p>
                            {qrcode.mode === 'dynamic' && qrcode.permalink && (
                                <p className="text-xs font-mono text-gray-500">
                                    {qrcode.permalink}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Analytics: ${qrcode.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* Top Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/qr-codes/${qrcode.id}`}>
                                    View QR Details
                                </Link>
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>

                    {/* Filters Bar */}
                    <Card className="bg-muted/30">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
                                <div className="space-y-2">
                                    <Label className="text-xs">Quick Range</Label>
                                    <Select onValueChange={handlePresetChange} defaultValue="30days">
                                        <SelectTrigger className="w-[140px] h-9 bg-background">
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7days">Last 7 Days</SelectItem>
                                            <SelectItem value="30days">Last 30 Days</SelectItem>
                                            <SelectItem value="month">This Month</SelectItem>
                                            <SelectItem value="year">Last Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">From Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input 
                                            type="date" 
                                            value={startDate} 
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-[140px] pl-9 h-9 bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">To Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input 
                                            type="date" 
                                            value={endDate} 
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-[140px] pl-9 h-9 bg-background"
                                        />
                                    </div>
                                </div>
                                
                                <div className="pb-0.5">
                                     <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2 text-muted-foreground hover:text-foreground">
                                        <X className="w-4 h-4 mr-1" />
                                        Reset
                                     </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
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
                                <div className="h-[300px] w-full">
                                    <ChartContainer config={chartConfig} className="h-full w-full">
                                        <BarChart accessibilityLayer data={scansOverTime}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="label"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="value" fill="var(--color-scans)" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
