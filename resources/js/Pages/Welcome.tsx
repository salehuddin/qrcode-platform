import { Head } from '@inertiajs/react';
import { PageProps, QRCodeType, QRCustomization } from '@/types';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { useMemo, useState } from 'react';
import { UrlForm } from './QRCode/Partials/UrlForm';
import { VCardForm } from './QRCode/Partials/VCardForm';
import { WifiForm } from './QRCode/Partials/WifiForm';
import { SmsForm } from './QRCode/Partials/SmsForm';
import { EmailForm } from './QRCode/Partials/EmailForm';
import { PhoneForm } from './QRCode/Partials/PhoneForm';
import { LocationForm } from './QRCode/Partials/LocationForm';
import { EventForm } from './QRCode/Partials/EventForm';
import { CustomizeForm } from './QRCode/Partials/CustomizeForm';
import { QRCodePreview } from './QRCode/Partials/QRCodePreview';
import HeroSection from '@/Components/HeroSection';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

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

export default function Welcome({ auth }: PageProps) {
    const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
    const [qrData, setQrData] = useState<any>({});
    const [customization, setCustomization] = useState<Partial<QRCustomization>>({
        dotsColor: '#000000',
        backgroundColor: '#ffffff',
        cornersSquareColor: '#000000',
        cornersDotsColor: '#000000',
        dotsType: 'square',
        cornersSquareType: 'square',
        cornersDotsType: 'dot',
        gradientEnabled: false,
        gradientType: 'linear',
        gradientStartColor: '#000000',
        gradientEndColor: '#000000',
        gradientRotation: 0,
        width: 300,
        height: 300,
        errorCorrectionLevel: 'M',
        imageSize: 0.2,
    });

    const handleTypeSelect = (type: QRCodeType) => {
        setSelectedType(type);
        setTimeout(() => {
            document.getElementById('configure')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleDataChange = (key: string, value: any) => {
        setQrData((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCustomizationChange = (key: keyof QRCustomization, value: string | number | boolean) => {
        setCustomization((prev) => {
            if (key === 'width' && typeof value === 'number' && !Number.isNaN(value)) {
                return { ...prev, width: value, height: value };
            }
            return { ...prev, [key]: value } as Partial<QRCustomization>;
        });
    };

    const encodeData = useMemo(() => {
        if (!selectedType) return '';
        try {
            switch (selectedType) {
                case 'url':
                    return qrData.url || '';
                case 'wifi': {
                    const ssid = qrData.ssid || '';
                    const pass = qrData.password || '';
                    const t = qrData.encryption || 'WPA';
                    const hidden = qrData.hidden ? 'H:true;' : '';
                    return `WIFI:T:${t};S:${ssid};P:${pass};${hidden};`;
                }
                case 'sms': {
                    const num = qrData.phone || '';
                    return `SMSTO:${num}:${qrData.message || ''}`;
                }
                case 'email': {
                    const to = qrData.to || '';
                    const subject = qrData.subject ? `?subject=${encodeURIComponent(qrData.subject)}` : '';
                    const body = qrData.body ? `${subject ? '&' : '?'}body=${encodeURIComponent(qrData.body)}` : '';
                    return `mailto:${to}${subject}${body}`;
                }
                case 'phone':
                    return qrData.number ? `tel:${qrData.number}` : '';
                case 'location': {
                    const lat = qrData.latitude;
                    const lng = qrData.longitude;
                    return lat && lng ? `geo:${lat},${lng}` : '';
                }
                case 'event': {
                    const dtStart = qrData.start ? new Date(qrData.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
                    const dtEnd = qrData.end ? new Date(qrData.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
                    const summary = qrData.title || '';
                    const location = qrData.location || '';
                    return `BEGIN:VCALENDAR\\nBEGIN:VEVENT\\nSUMMARY:${summary}\\nLOCATION:${location}\\nDTSTART:${dtStart}\\nDTEND:${dtEnd}\\nEND:VEVENT\\nEND:VCALENDAR`;
                }
                case 'vcard': {
                    const first = qrData.firstName || '';
                    const last = qrData.lastName || '';
                    const phone = qrData.phone || '';
                    const email = qrData.email || '';
                    const org = qrData.organization || '';
                    const title = qrData.title || '';
                    return `BEGIN:VCARD\\nVERSION:3.0\\nN:${last};${first};;;\\nFN:${first} ${last}\\nORG:${org}\\nTITLE:${title}\\nTEL;TYPE=CELL:${phone}\\nEMAIL:${email}\\nEND:VCARD`;
                }
                default:
                    return '';
            }
        } catch {
            return '';
        }
    }, [selectedType, qrData]);

    const handleDownload = async (format: 'png' | 'svg') => {
        if (!encodeData) return;

        const qrCode = new QRCodeStyling({
            data: encodeData,
            width: customization.width || 1024,
            height: customization.height || 1024,
            type: 'canvas',
            dotsOptions: {
                color: customization.gradientEnabled 
                    ? undefined 
                    : customization.dotsColor,
                type: customization.dotsType as any,
                gradient: customization.gradientEnabled ? {
                    type: customization.gradientType as any,
                    rotation: customization.gradientRotation,
                    colorStops: [
                        { offset: 0, color: customization.gradientStartColor || '#000000' },
                        { offset: 1, color: customization.gradientEndColor || '#000000' }
                    ]
                } : undefined,
            },
            backgroundOptions: {
                color: customization.backgroundColor,
            },
            cornersSquareOptions: {
                color: customization.cornersSquareColor,
                type: customization.cornersSquareType as any,
            },
            cornersDotOptions: {
                color: customization.cornersDotsColor,
                type: customization.cornersDotsType as any,
            },
            imageOptions: customization.image ? {
                imageSize: customization.imageSize || 0.2,
                margin: 0,
            } : undefined,
            image: customization.image,
            qrOptions: {
                errorCorrectionLevel: customization.errorCorrectionLevel as any || 'M',
            },
        });

        qrCode.download({ name: 'qrcode', extension: format });
    };

    return (
        <>
            <Head title="Free QR Code Generator" />
            
            {/* Hero Section */}
            <HeroSection />

            {/* QR Generator Section */}
            <section id="generator" className="py-16 bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Create Your QR Code
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Choose a type, customize the design, and download instantly
                        </p>
                    </div>

                    {/* Type Selection */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {qrTypes.map((qrType) => (
                            <Card
                                key={qrType.type}
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                    selectedType === qrType.type
                                        ? 'ring-2 ring-primary bg-primary/5'
                                        : 'hover:bg-accent/50'
                                }`}
                                onClick={() => handleTypeSelect(qrType.type)}
                            >
                                <CardContent className="p-6">
                                    <div className="text-4xl mb-3">{qrType.icon}</div>
                                    <h3 className="font-semibold text-foreground mb-1">
                                        {qrType.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {qrType.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Configuration Section */}
                    {selectedType && (
                        <div id="configure" className="grid gap-8 lg:grid-cols-2">
                            {/* Left: Content & Customization */}
                            <div className="space-y-6">
                                {/* Content Form */}
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">QR Code Content</h3>
                                        {selectedType === 'url' && (
                                            <UrlForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'vcard' && (
                                            <VCardForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'wifi' && (
                                            <WifiForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'sms' && (
                                            <SmsForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'email' && (
                                            <EmailForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'phone' && (
                                            <PhoneForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'location' && (
                                            <LocationForm data={qrData} onChange={handleDataChange} />
                                        )}
                                        {selectedType === 'event' && (
                                            <EventForm data={qrData} onChange={handleDataChange} />
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Customization */}
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Customize Design</h3>
                                        <CustomizeForm
                                            qrData={qrData}
                                            customization={customization}
                                            onCustomizationChange={handleCustomizationChange}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right: Preview & Download */}
                            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Preview</h3>
                                        <div className="flex justify-center">
                                            <QRCodePreview
                                                data={encodeData}
                                                showDownloadButtons={false}
                                                customization={customization}
                                            />
                                        </div>

                                        {/* Download Button */}
                                        <div className="mt-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className="w-full" size="lg" disabled={!encodeData}>
                                                        <Download className="w-5 h-5 mr-2" />
                                                        Download QR Code
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuItem onClick={() => handleDownload('png')}>
                                                        PNG (Raster)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDownload('svg')}>
                                                        SVG (Vector)
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            
                                            {!encodeData && (
                                                <p className="text-sm text-muted-foreground text-center mt-2">
                                                    Fill in the required fields to enable download
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* CTA Card */}
                                <Card className="bg-primary text-primary-foreground">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-2">Light Up 7 Staff?</h3>
                                        <p className="text-sm mb-4 opacity-90">
                                            Log in to access advanced features: save QR codes, track scans, manage folders, and collaborate with your team!
                                        </p>
                                        <Button variant="secondary" className="w-full" asChild>
                                            <a href="/login">Staff Login</a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
