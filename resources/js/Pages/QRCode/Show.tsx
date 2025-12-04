import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, QRCode, QRCustomization } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { QRCodePreview } from './Partials/QRCodePreview';

interface QRCodeShowProps extends PageProps {
    qrCode: QRCode;
}

export default function Show({ auth, qrCode }: QRCodeShowProps) {
    console.log('Show props:', { qrCode });

    const currentQR = qrCode;

    // Ensure customization is a complete object with defaults to prevent crashes
    const customization: QRCustomization = {
        dotsColor: currentQR.customization?.dotsColor ?? currentQR.design?.foreground_color ?? '#000000',
        backgroundColor: currentQR.customization?.backgroundColor ?? currentQR.design?.background_color ?? '#ffffff',
        cornersSquareColor: currentQR.customization?.cornersSquareColor ?? currentQR.design?.foreground_color ?? '#000000',
        cornersDotsColor: currentQR.customization?.cornersDotsColor ?? currentQR.design?.foreground_color ?? '#000000',
        dotsType: currentQR.customization?.dotsType ?? (currentQR.design?.pattern === 'dots' ? 'dots' : currentQR.design?.pattern === 'rounded' ? 'rounded' : 'square'),
        cornersSquareType: currentQR.customization?.cornersSquareType ?? 'square',
        cornersDotsType: currentQR.customization?.cornersDotsType ?? 'dot',
        width: currentQR.customization?.width ?? 300,
        height: currentQR.customization?.height ?? 300,
        errorCorrectionLevel: currentQR.customization?.errorCorrectionLevel ?? currentQR.design?.error_correction ?? 'M',
        imageSize: currentQR.customization?.imageSize ?? 0.2,
        gradientEnabled: currentQR.customization?.gradientEnabled ?? false,
        gradientType: currentQR.customization?.gradientType ?? 'linear',
        gradientStartColor: currentQR.customization?.gradientStartColor ?? '#000000',
        gradientEndColor: currentQR.customization?.gradientEndColor ?? '#000000',
        gradientRotation: currentQR.customization?.gradientRotation ?? 0,
        image: currentQR.customization?.image,
    };

    const handleEdit = () => {
        router.visit(`/qr-codes/${currentQR.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this QR code?')) {
            router.delete(`/qr-codes/${currentQR.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    QR Code Details
                </h2>
            }
        >
            <Head title={`QR Code: ${currentQR.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Back button & Actions */}
                        <div className="flex items-center justify-between">
                            <Link
                                href="/qr-codes"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                ← Back to QR Codes
                            </Link>
                            <div className="flex gap-2">
                                <Button asChild variant="outline">
                                    <Link href={`/qr-codes/${currentQR.id}/analytics`}>
                                        View Analytics
                                    </Link>
                                </Button>
                                <Button onClick={handleEdit} variant="outline">
                                    Edit
                                </Button>
                                <Button onClick={handleDelete} variant="destructive">
                                    Delete
                                </Button>
                            </div>
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
                                    <div className="w-full max-w-xs">
                                        <QRCodePreview data={currentQR.content} customization={customization} />
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
                        <Card>
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
                                                style={{ backgroundColor: currentQR.design?.foreground_color ?? '#000000' }}
                                            ></div>
                                            <span className="text-sm">{currentQR.design?.foreground_color ?? '#000000'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Background Color</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div 
                                                className="w-4 h-4 rounded border"
                                                style={{ backgroundColor: currentQR.design?.background_color ?? '#ffffff' }}
                                            ></div>
                                            <span className="text-sm">{currentQR.design?.background_color ?? '#ffffff'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Pattern</label>
                                        <p className="text-sm mt-1 capitalize">{currentQR.design?.pattern ?? 'square'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Error Correction</label>
                                        <p className="text-sm mt-1">{currentQR.design?.error_correction ?? 'M'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}