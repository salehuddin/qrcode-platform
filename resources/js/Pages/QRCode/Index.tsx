import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, QRCode } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

// Mock data for development
const mockQRCodes: QRCode[] = [
    {
        id: '1',
        name: 'Restaurant Menu',
        type: 'url',
        content: 'https://restaurant.com/menu',
        destination_url: 'https://restaurant.com/menu',
        is_active: true,
        scan_count: 156,
        unique_scans: 134,
        last_scanned_at: '2024-01-20 14:30:00',
        created_at: '2024-01-15 10:00:00',
        updated_at: '2024-01-20 14:30:00',
        design: {
            foreground_color: '#000000',
            background_color: '#ffffff',
            pattern: 'square',
            error_correction: 'M'
        },
        user_id: 1
    },
    {
        id: '2',
        name: 'Business Card',
        type: 'vcard',
        content: 'John Doe Contact Info',
        is_active: true,
        scan_count: 89,
        unique_scans: 76,
        last_scanned_at: '2024-01-19 16:45:00',
        created_at: '2024-01-10 09:15:00',
        updated_at: '2024-01-18 11:22:00',
        design: {
            foreground_color: '#1f2937',
            background_color: '#f3f4f6',
            pattern: 'rounded',
            error_correction: 'M'
        },
        user_id: 1
    },
    {
        id: '3',
        name: 'WiFi Network',
        type: 'wifi',
        content: 'Guest WiFi Access',
        is_active: false,
        scan_count: 23,
        unique_scans: 19,
        last_scanned_at: '2024-01-18 09:12:00',
        created_at: '2024-01-12 15:30:00',
        updated_at: '2024-01-17 12:45:00',
        design: {
            foreground_color: '#2563eb',
            background_color: '#ffffff',
            pattern: 'dots',
            error_correction: 'H'
        },
        user_id: 1
    },
    {
        id: '4',
        name: 'Contact Form',
        type: 'url',
        content: 'https://company.com/contact',
        destination_url: 'https://company.com/contact',
        is_active: true,
        scan_count: 67,
        unique_scans: 54,
        last_scanned_at: '2024-01-21 08:15:00',
        created_at: '2024-01-14 13:20:00',
        updated_at: '2024-01-21 08:15:00',
        design: {
            foreground_color: '#dc2626',
            background_color: '#fef2f2',
            pattern: 'rounded',
            error_correction: 'M'
        },
        user_id: 1
    }
];

interface QRCodeIndexProps extends PageProps {
    qrCodes?: QRCode[];
}

export default function QRCodeIndex({ qrCodes = mockQRCodes }: QRCodeIndexProps) {
    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            url: '🔗',
            vcard: '👤',
            wifi: '📶',
            sms: '💬',
            email: '📧',
            phone: '📞',
            location: '📍',
            event: '📅'
        };
        return icons[type] || '📱';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        QR Codes
                    </h2>
                    <Button asChild>
                        <Link href="/qr-codes/create">
                            Create New QR Code
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="QR Codes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total QR Codes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{qrCodes.length}</div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Active QR Codes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {qrCodes.filter(qr => qr.is_active).length}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Scans
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* QR Codes Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {qrCodes.map((qr) => (
                                <Card key={qr.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">{getTypeIcon(qr.type)}</div>
                                                <div>
                                                    <CardTitle className="text-lg">{qr.name}</CardTitle>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge 
                                                            variant={qr.is_active ? "default" : "secondary"}
                                                        >
                                                            {qr.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {qr.type.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* QR Code Preview */}
                                            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                                                <div 
                                                    className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl"
                                                    style={{ 
                                                        backgroundColor: qr.design.background_color,
                                                        color: qr.design.foreground_color 
                                                    }}
                                                >
                                                    ⬜
                                                </div>
                                            </div>
                                            
                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-muted-foreground">Scans</div>
                                                    <div className="font-medium">{qr.scan_count}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">Unique</div>
                                                    <div className="font-medium">{qr.unique_scans}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Last Scanned */}
                                            <div className="text-xs text-muted-foreground">
                                                {qr.last_scanned_at 
                                                    ? `Last scanned: ${new Date(qr.last_scanned_at).toLocaleDateString()}`
                                                    : 'Never scanned'
                                                }
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button asChild size="sm" className="flex-1">
                                                    <Link href={`/qr-codes/${qr.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/qr-codes/${qr.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {qrCodes.length === 0 && (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <div className="text-6xl mb-4">📱</div>
                                    <h3 className="text-lg font-medium mb-2">No QR Codes Yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Create your first QR code to get started
                                    </p>
                                    <Button asChild>
                                        <Link href="/qr-codes/create">
                                            Create Your First QR Code
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