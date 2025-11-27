import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import type { PageProps } from '@/types';

interface PlatformStat {
    label: string;
    value: string | number;
    sublabel?: string;
}

interface UserGrowthPoint {
    label: string;
    value: number;
}

interface RecentActivityItem {
    id: number;
    type: 'user' | 'subscription' | 'support';
    message: string;
    created_at: string;
}

interface AdminDashboardProps extends PageProps {
    platformStats: PlatformStat[];
    userGrowth: UserGrowthPoint[];
    systemHealth: {
        status: 'healthy' | 'degraded' | 'down';
        incidentsOpen: number;
        lastIncident?: string;
    };
    revenueSummary: {
        mrr: number;
        arr: number;
        arpu: number;
        churnRate: number;
    };
    recentActivity: RecentActivityItem[];
}

export default function AdminDashboard({
    platformStats,
    userGrowth,
    systemHealth,
    revenueSummary,
    recentActivity,
}: AdminDashboardProps) {
    const maxGrowth = Math.max(...userGrowth.map((p) => p.value), 1);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">Admin Dashboard</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Platform-wide overview for administrators
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}>
                            {systemHealth.status === 'healthy'
                                ? 'System Healthy'
                                : systemHealth.status === 'degraded'
                                ? 'Performance Degraded'
                                : 'System Down'}
                        </Badge>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* Top stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {platformStats.map((stat) => (
                            <Card key={stat.label}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    {stat.sublabel && (
                                        <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* User growth */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>User Growth (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-40 items-end gap-2">
                                    {userGrowth.map((point) => (
                                        <div
                                            key={point.label}
                                            className="flex flex-1 flex-col items-center gap-1"
                                        >
                                            <div
                                                className="w-full rounded-t bg-primary/70"
                                                style={{
                                                    height: `${(point.value / maxGrowth) * 100}%`,
                                                }}
                                            />
                                            <span className="text-[10px] text-muted-foreground">
                                                {point.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenue summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue &amp; Churn</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>MRR</span>
                                    <span className="font-medium">
                                        ${revenueSummary.mrr.toLocaleString('en-US')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>ARR</span>
                                    <span className="font-medium">
                                        ${revenueSummary.arr.toLocaleString('en-US')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>ARPU</span>
                                    <span className="font-medium">
                                        ${revenueSummary.arpu.toFixed(2)} / user
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Churn Rate</span>
                                    <span className="font-medium text-amber-600">
                                        {revenueSummary.churnRate.toFixed(2)}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* System health */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Health</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>Open incidents</span>
                                    <span className="font-medium">{systemHealth.incidentsOpen}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Last incident:{' '}
                                        {systemHealth.lastIncident || 'None recorded'}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="#">View status page (mock)</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent activity */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start justify-between border-b pb-2 last:border-0 last:pb-0"
                                    >
                                        <div className="space-y-1">
                                            <p>{activity.message}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] uppercase">
                                            {activity.type}
                                        </Badge>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No recent activity.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
