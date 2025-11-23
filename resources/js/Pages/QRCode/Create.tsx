import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, QRCodeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useState } from 'react';

const qrTypes: Array<{
    type: QRCodeType;
    title: string;
    description: string;
    icon: string;
    popular?: boolean;
}> = [
    {
        type: 'url',
        title: 'Website URL',
        description: 'Link to any website or webpage',
        icon: '🔗',
        popular: true
    },
    {
        type: 'vcard',
        title: 'Contact Card',
        description: 'Share contact information easily',
        icon: '👤',
        popular: true
    },
    {
        type: 'wifi',
        title: 'WiFi Network',
        description: 'Connect to WiFi automatically',
        icon: '📶'
    },
    {
        type: 'sms',
        title: 'Text Message',
        description: 'Pre-filled SMS message',
        icon: '💬'
    },
    {
        type: 'email',
        title: 'Email',
        description: 'Send email with subject and body',
        icon: '📧'
    },
    {
        type: 'phone',
        title: 'Phone Number',
        description: 'Call a phone number directly',
        icon: '📞'
    },
    {
        type: 'location',
        title: 'Location',
        description: 'Share GPS coordinates',
        icon: '📍'
    },
    {
        type: 'event',
        title: 'Calendar Event',
        description: 'Add event to calendar',
        icon: '📅'
    }
];

export default function CreateQRCode({}: PageProps) {
    const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);

    const handleTypeSelect = (type: QRCodeType) => {
        setSelectedType(type);
        // In a real app, this would navigate to the form for the selected type
        console.log('Selected QR type:', type);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Create QR Code
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Choose the type of QR code you want to create
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/qr-codes">
                            Back to QR Codes
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Create QR Code" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Step Indicator */}
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    1
                                </div>
                                <div className="ml-2 text-sm font-medium">Select Type</div>
                            </div>
                            <div className="h-px w-12 bg-gray-300" />
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-sm font-medium">
                                    2
                                </div>
                                <div className="ml-2 text-sm text-gray-600">Configure</div>
                            </div>
                            <div className="h-px w-12 bg-gray-300" />
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-sm font-medium">
                                    3
                                </div>
                                <div className="ml-2 text-sm text-gray-600">Customize</div>
                            </div>
                        </div>

                        {/* Popular Types */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                                <span className="mr-2">⭐</span>
                                Popular QR Code Types
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {qrTypes.filter(type => type.popular).map((qrType) => (
                                    <Card 
                                        key={qrType.type}
                                        className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                                            selectedType === qrType.type 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => handleTypeSelect(qrType.type)}
                                    >
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-3xl">{qrType.icon}</div>
                                                    <div>
                                                        <CardTitle className="text-lg">{qrType.title}</CardTitle>
                                                        <CardDescription>{qrType.description}</CardDescription>
                                                    </div>
                                                </div>
                                                {qrType.popular && (
                                                    <Badge variant="secondary">Popular</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}\n                            </div>
                        </div>

                        {/* All Types */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">All QR Code Types</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {qrTypes.map((qrType) => (
                                    <Card 
                                        key={qrType.type}
                                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                                            selectedType === qrType.type 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/30'
                                        }`}
                                        onClick={() => handleTypeSelect(qrType.type)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">{qrType.icon}</div>
                                                <div>
                                                    <div className="font-medium">{qrType.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {qrType.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Selected Type Preview */}
                        {selectedType && (
                            <Card className="border-primary">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <span className="mr-2">✅</span>
                                        Selected: {qrTypes.find(t => t.type === selectedType)?.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Ready to configure your {qrTypes.find(t => t.type === selectedType)?.title} QR code
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        <Button>
                                            Continue to Configuration
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={() => setSelectedType(null)}
                                        >
                                            Change Type
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Help Section */}
                        <Card className="bg-muted/50">
                            <CardContent className="p-6">
                                <h3 className="font-medium mb-2">Need Help Choosing?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Not sure which QR code type to choose? Here are some common use cases:
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• <strong>Website URL:</strong> Restaurant menus, business websites, social media profiles</li>
                                    <li>• <strong>Contact Card:</strong> Business cards, networking events</li>
                                    <li>• <strong>WiFi Network:</strong> Guest networks, events, cafes</li>
                                    <li>• <strong>Location:</strong> Event venues, business addresses, meeting points</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}