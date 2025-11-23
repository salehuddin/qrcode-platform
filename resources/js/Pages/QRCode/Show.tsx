import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { QRCode } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

interface QRCodeShowProps extends PageProps {
    qrcode: QRCode;
}

export default function Show({ auth, qrcode }: QRCodeShowProps) {
    // Mock data for demonstration
    const mockQRCode: QRCode = {
        id: '1',
        name: 'Website Homepage',
        type: 'url',
        content: 'https://example.com',
        destination_url: 'https://example.com',
        is_active: true,
        scan_count: 245,
        unique_scans: 198,
        last_scanned_at: '2024-11-23 14:30:00',
        created_at: '2024-11-20 10:00:00',
        updated_at: '2024-11-23 14:30:00',
        design: {
            foreground_color: '#000000',
            background_color: '#FFFFFF',
            pattern: 'square',
            error_correction: 'M'
        },
        user_id: 1
    };

    const currentQR = qrcode || mockQRCode;

    const handleEdit = () => {
        router.visit(`/qr-codes/${currentQR.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this QR code?')) {
            router.delete(`/qr-codes/${currentQR.id}`);
        }
    };

    const handleDownload = () => {
        // Mock download functionality
        alert('Download QR code functionality will be implemented here');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        QR Code Details
                    </h2>
                    <div className="flex gap-2">
                        <Button onClick={handleEdit} variant="outline">
                            Edit
                        </Button>
                        <Button onClick={handleDownload}>
                            Download
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`QR Code: ${currentQR.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Back button */}
                            <div className="mb-6">
                                <Link
                                    href="/qr-codes"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ← Back to QR Codes
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* QR Code Preview */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>QR Code Preview</CardTitle>
                                        <CardDescription>
                                            Scan this QR code to test functionality
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-center">
                                        <div className="w-48 h-48 bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <span className="text-gray-500">QR Code Image</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* QR Code Information */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{currentQR.name}</CardTitle>
                                                <CardDescription>
                                                    {currentQR.type.toUpperCase()} QR Code
                                                </CardDescription>
                                            </div>
                                            <Badge variant={currentQR.is_active ? "default" : "secondary"}>
                                                {currentQR.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Destination</label>
                                            <p className="text-sm break-all">{currentQR.destination_url || currentQR.content}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Total Scans</label>
                                                <p className="text-2xl font-bold text-blue-600">{currentQR.scan_count}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Unique Scans</label>
                                                <p className="text-2xl font-bold text-green-600">{currentQR.unique_scans}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Last Scanned</label>
                                            <p className="text-sm">
                                                {currentQR.last_scanned_at ? 
                                                    new Date(currentQR.last_scanned_at).toLocaleString() : 
                                                    'Never'
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Created</label>
                                            <p className="text-sm">{new Date(currentQR.created_at).toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Design Settings */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Design Settings</CardTitle>
                                    <CardDescription>Current design configuration</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Foreground Color</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div 
                                                    className="w-4 h-4 rounded border"
                                                    style={{ backgroundColor: currentQR.design.foreground_color }}
                                                ></div>
                                                <span className="text-sm">{currentQR.design.foreground_color}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Background Color</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div 
                                                    className="w-4 h-4 rounded border"
                                                    style={{ backgroundColor: currentQR.design.background_color }}
                                                ></div>
                                                <span className="text-sm">{currentQR.design.background_color}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Pattern</label>
                                            <p className="text-sm mt-1 capitalize">{currentQR.design.pattern}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Error Correction</label>
                                            <p className="text-sm mt-1">{currentQR.design.error_correction}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                <Button onClick={handleEdit}>
                                    Edit QR Code
                                </Button>
                                <Button onClick={handleDownload} variant="outline">
                                    Download PNG
                                </Button>
                                <Button onClick={handleDownload} variant="outline">
                                    Download SVG
                                </Button>
                                <Button onClick={handleDelete} variant="destructive">
                                    Delete QR Code
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}