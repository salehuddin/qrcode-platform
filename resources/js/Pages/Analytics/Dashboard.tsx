import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import type { PageProps, QRCode } from '@/types';
import { useState, useEffect } from 'react';
import { Download, Filter, Calendar as CalendarIcon, X } from 'lucide-react';

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart"

const chartConfig = {
  scans: {
    label: "Scans",
    color: "#10b981", // emerald-500 to match Peak Scanning Times
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
    qrCodes: { id: number; name: string }[];
    filters: {
        start_date: string;
        end_date: string;
        qr_code_id: string | null;
    };
}

export default function AnalyticsDashboard({
    summary,
    scansOverTime,
    deviceBreakdown,
    osBreakdown,
    topQrCodes,
    qrCodes,
    filters,
}: AnalyticsDashboardProps) {
    const maxScanValue = Math.max(...scansOverTime.map((p) => p.value), 1);
    
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [selectedQrId, setSelectedQrId] = useState<string>(filters.qr_code_id || 'all');

    // Debounce filter application
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (
                startDate !== filters.start_date || 
                endDate !== filters.end_date || 
                (selectedQrId !== 'all' && selectedQrId !== filters.qr_code_id) ||
                (selectedQrId === 'all' && filters.qr_code_id)
            ) {
                applyFilters();
            }
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [startDate, endDate, selectedQrId]);

    const applyFilters = () => {
        router.get(
            route('analytics'),
            {
                start_date: startDate,
                end_date: endDate,
                qr_code_id: selectedQrId === 'all' ? null : selectedQrId,
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

    const handleExport = () => {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
        });
        
        if (selectedQrId && selectedQrId !== 'all') {
            params.append('qr_code_id', selectedQrId);
        }

        window.location.href = route('analytics.export') + '?' + params.toString();
    };

    const clearFilters = () => {
         const end = new Date();
         const start = new Date();
         start.setDate(end.getDate() - 29);
         
         setStartDate(start.toISOString().split('T')[0]);
         setEndDate(end.toISOString().split('T')[0]);
         setSelectedQrId('all');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">
                            Analytics Dashboard
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Overview of scans, devices, and top performing QR codes
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                         </Button>
                    </div>
                </div>
            }
        >
            <Head title="Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
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

                                <div className="space-y-2 flex-grow max-w-xs">
                                    <Label className="text-xs">Filter by QR Code</Label>
                                    <Select value={selectedQrId} onValueChange={setSelectedQrId}>
                                        <SelectTrigger className="w-full h-9 bg-background">
                                            <SelectValue placeholder="All QR Codes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All QR Codes</SelectItem>
                                            {qrCodes.map(qr => (
                                                <SelectItem key={qr.id} value={qr.id.toString()}>
                                                    {qr.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.total_scans}</div>
                                <p className="text-xs text-muted-foreground mt-1">In selected period</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Unique Scanners</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.unique_scanners}</div>
                                <p className="text-xs text-muted-foreground mt-1">Distinct devices</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.scans_this_month}</div>
                                <p className="text-xs text-muted-foreground mt-1">Filtered by QR if selected</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.active_qr_codes}</div>
                                <p className="text-xs text-muted-foreground mt-1">Currently active</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Scans over time */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Scans Over Time</CardTitle>
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


                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Device breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Devices</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {deviceBreakdown.length > 0 ? deviceBreakdown.map((d) => (
                                    <div key={d.label} className="flex items-center justify-between text-sm">
                                        <span>{d.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-primary rounded-full"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-12 text-right">
                                                {d.value} ({d.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No device data</p>}
                            </CardContent>
                        </Card>

                        {/* OS breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Operating Systems</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {osBreakdown.length > 0 ? osBreakdown.map((d) => (
                                    <div key={d.label} className="flex items-center justify-between text-sm">
                                        <span>{d.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-blue-500 rounded-full"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-12 text-right">
                                                {d.value} ({d.percent}%)
                                            </span>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No OS data</p>}
                            </CardContent>
                        </Card>

                        {/* Top performing QR codes */}
                        {!selectedQrId || selectedQrId === 'all' ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Performing QR Codes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {topQrCodes.map((qr) => (
                                        <div key={qr.id} className="flex items-center justify-between text-sm">
                                            <div className="flex flex-col">
                                                <Link href={route('qr-codes.show', qr.id)} className="font-medium truncate max-w-[150px] hover:underline hover:text-blue-600">
                                                    {qr.name}
                                                </Link>
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
                        ) : (
                             <Card>
                                <CardHeader>
                                    <CardTitle>QR Code Details</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center h-[200px] gap-4">
                                    <p className="text-muted-foreground text-center text-sm">
                                        Filtering by single QR code.<br/>
                                        View full details in individual analytics.
                                    </p>
                                    <Button variant="outline" asChild>
                                        <Link href={route('qr-codes.analytics', selectedQrId)}>
                                            Go to QR Analytics
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
