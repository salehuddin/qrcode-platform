import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, QRCodeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useState } from 'react';
import { UrlForm } from './Partials/UrlForm';
import { VCardForm } from './Partials/VCardForm';
import { WifiForm } from './Partials/WifiForm';
import { SmsForm } from './Partials/SmsForm';
import { EmailForm } from './Partials/EmailForm';
import { PhoneForm } from './Partials/PhoneForm';
import { LocationForm } from './Partials/LocationForm';
import { EventForm } from './Partials/EventForm';

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
    const [qrData, setQrData] = useState<any>({});

    const handleTypeSelect = (type: QRCodeType) => {
        setSelectedType(type);
        // Automatically scroll to configure section
        setTimeout(() => {
            document.getElementById('configure')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDataChange = (key: string, value: any) => {
        setQrData((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    const renderForm = () => {
        switch (selectedType) {
            case 'url':
                return <UrlForm data={qrData} onChange={handleDataChange} />;
            case 'vcard':
                return <VCardForm data={qrData} onChange={handleDataChange} />;
            case 'wifi':
                return <WifiForm data={qrData} onChange={handleDataChange} />;
            case 'sms':
                return <SmsForm data={qrData} onChange={handleDataChange} />;
            case 'email':
                return <EmailForm data={qrData} onChange={handleDataChange} />;
            case 'phone':
                return <PhoneForm data={qrData} onChange={handleDataChange} />;
            case 'location':
                return <LocationForm data={qrData} onChange={handleDataChange} />;
            case 'event':
                return <EventForm data={qrData} onChange={handleDataChange} />;
            default:
                return null;
        }
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
                            Create and customize your dynamic QR code
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
                    <div className="space-y-12">
                        {/* Sticky Navigation */}
                        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 border-b">
                            <div className="flex items-center justify-center space-x-8">
                                {[
                                    { id: 'select-type', label: '1. Select Type' },
                                    { id: 'configure', label: '2. Configure' },
                                    { id: 'customize', label: '3. Customize' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 1: Select Type */}
                        <div id="select-type" className="scroll-mt-24 space-y-6">
                            <h3 className="text-2xl font-bold">1. Select QR Code Type</h3>
                            
                            {/* Popular Types */}
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Popular</h4>
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
                                    ))}
                                </div>
                            </div>

                            {/* All Types */}
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">All Types</h4>
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
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-12">
                                {/* Section 2: Configure */}
                                <div id="configure" className="scroll-mt-24 space-y-6">
                                    <h3 className="text-2xl font-bold">2. Configure Content</h3>
                                    
                                    <Card className={!selectedType ? "opacity-50 pointer-events-none" : ""}>
                                        <CardHeader>
                                            <CardTitle>
                                                {selectedType 
                                                    ? `Configure ${qrTypes.find(t => t.type === selectedType)?.title}`
                                                    : "Select a QR Code Type first"
                                                }
                                            </CardTitle>
                                            <CardDescription>
                                                {selectedType 
                                                    ? "Enter the content for your QR code below"
                                                    : "Please choose a type from the section above to proceed"
                                                }
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {selectedType ? renderForm() : (
                                                <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                                                    <p className="text-muted-foreground">No type selected</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Section 3: Customize */}
                                <div id="customize" className="scroll-mt-24 space-y-6">
                                    <h3 className="text-2xl font-bold">3. Customize Design</h3>
                                    
                                    <Card className={!selectedType ? "opacity-50 pointer-events-none" : ""}>
                                        <CardHeader>
                                            <CardTitle>Design Options</CardTitle>
                                            <CardDescription>
                                                Make your QR code unique
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">
                                                    Design customization features coming soon.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            size="lg" 
                                            disabled={!selectedType}
                                            className="w-full sm:w-auto"
                                        >
                                            Create QR Code
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Preview */}
                            <div className="hidden lg:block">
                                <div className="sticky top-24 space-y-4">
                                    <Card className="border-2 border-primary/20 overflow-hidden">
                                        <CardHeader className="bg-muted/50 pb-4">
                                            <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col items-center justify-center p-8 bg-white">
                                            <div className="w-48 h-48 bg-white border-2 border-gray-900 flex items-center justify-center rounded-lg shadow-sm">
                                                {/* This would be the actual QR code component */}
                                                <div className="grid grid-cols-2 gap-1 w-32 h-32 opacity-20">
                                                    <div className="bg-black rounded-sm"></div>
                                                    <div className="bg-black rounded-sm"></div>
                                                    <div className="bg-black rounded-sm"></div>
                                                    <div className="bg-black rounded-sm"></div>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-xs text-muted-foreground text-center">
                                                {selectedType 
                                                    ? `${qrTypes.find(t => t.type === selectedType)?.title} QR Code`
                                                    : "Select a type to preview"
                                                }
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
