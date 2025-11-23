import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { PageProps, DashboardStats } from '@/types';

export default function Dashboard({ stats }: PageProps<{ stats: DashboardStats }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total QR Codes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_qr_codes}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.active_qr_codes} active
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Scans
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_scans}</div>
                                <p className="text-xs text-muted-foreground">
                                    Lifetime scans
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.scans_this_month}</div>
                                <p className="text-xs text-muted-foreground">
                                    Scans in current month
                                </p>
                            </CardContent>
                        </Card>
                         <Card className="flex flex-col justify-center items-center p-6">
                            <Link href={route('qr-codes.create')} className="w-full">
                                <Button className="w-full">Create New QR Code</Button>
                            </Link>
                        </Card>
                    </div>

                    {/* Top Performing Codes */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Top Performing QR Codes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {stats.top_performing_codes.map((qr) => (
                                        <div key={qr.id} className="flex items-center">
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{qr.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {qr.type.toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium">+{qr.scan_count} scans</div>
                                        </div>
                                    ))}
                                    {stats.top_performing_codes.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No data available yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                         {/* Recent Activity Placeholder */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href={route('qr-codes.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        View All QR Codes
                                    </Button>
                                </Link>
                                <Link href={route('profile.edit')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        Manage Profile
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
