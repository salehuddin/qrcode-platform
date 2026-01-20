import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, QRCodeType, QRCustomization, QRCodeMode, QRCode, Folder, Tag, BrandKit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useMemo, useState, useEffect } from 'react';
import { UrlForm } from './Partials/UrlForm';
import { VCardForm } from './Partials/VCardForm';
import { WifiForm } from './Partials/WifiForm';
import { SmsForm } from './Partials/SmsForm';
import { EmailForm } from './Partials/EmailForm';
import { PhoneForm } from './Partials/PhoneForm';
import { LocationForm } from './Partials/LocationForm';
import { EventForm } from './Partials/EventForm';
import { CustomizeForm } from './Partials/CustomizeForm';
import { QRCodePreview } from './Partials/QRCodePreview';

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

interface EditQRCodeProps extends PageProps {
    qrCode: QRCode;
    folders: Folder[];
    tags: Tag[];
    brandKits: BrandKit[];
}

export default function EditQRCode({ qrCode, folders, tags, brandKits }: EditQRCodeProps) {
    const [selectedType] = useState<QRCodeType>(qrCode.type as QRCodeType);
    const [mode] = useState<QRCodeMode>((qrCode.mode || 'static') as QRCodeMode);
    const [name, setName] = useState(qrCode.name);
    const [description, setDescription] = useState(qrCode.description || '');
    const [selectedFolderId, setSelectedFolderId] = useState<string>(qrCode.folder_id ? qrCode.folder_id.toString() : 'none');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>(qrCode.tags ? qrCode.tags.map(t => t.id) : []);
    const [qrData, setQrData] = useState<any>({});
    const [customization, setCustomization] = useState<Partial<QRCustomization>>(
        qrCode.customization || {
            dotsColor: qrCode.design?.foreground_color || '#000000',
            backgroundColor: qrCode.design?.background_color || '#ffffff',
            cornersSquareColor: qrCode.design?.foreground_color || '#000000',
            cornersDotsColor: qrCode.design?.foreground_color || '#000000',
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
            errorCorrectionLevel: qrCode.design?.error_correction || 'M',
            imageSize: 0.2,
        }
    );

    // Flatten folders for select
    const flattenFolders = (nodes: Folder[], depth = 0): Array<{ id: number; name: string; depth: number }> => {
        return nodes.reduce((acc, node) => {
            acc.push({ id: node.id, name: node.name, depth });
            if (node.children) {
                acc.push(...flattenFolders(node.children, depth + 1));
            }
            return acc;
        }, [] as Array<{ id: number; name: string; depth: number }>);
    };

    const flatFolders = useMemo(() => flattenFolders(folders || []), [folders]);

    const toggleTag = (tagId: number) => {
        setSelectedTagIds(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    // Parse existing content to populate form fields
    useEffect(() => {
        const content = qrCode.content;
        const parsedData: any = {};

        try {
            switch (selectedType) {
                case 'url':
                    parsedData.url = qrCode.destination_url || content;
                    break;
                case 'wifi':
                    // Parse WIFI:T:WPA;S:MyNetwork;P:password;;
                    const wifiMatch = content.match(/WIFI:T:([^;]+);S:([^;]+);P:([^;]+);/);
                    if (wifiMatch) {
                        parsedData.encryption = wifiMatch[1];
                        parsedData.ssid = wifiMatch[2];
                        parsedData.password = wifiMatch[3];
                    }
                    break;
                case 'vcard':
                    // Basic vCard parsing
                    const nameMatch = content.match(/FN:([^\n]+)/);
                    const phoneMatch = content.match(/TEL[^:]*:([^\n]+)/);
                    const emailMatch = content.match(/EMAIL:([^\n]+)/);
                    if (nameMatch) {
                        const nameParts = nameMatch[1].split(' ');
                        parsedData.firstName = nameParts[0] || '';
                        parsedData.lastName = nameParts.slice(1).join(' ') || '';
                    }
                    if (phoneMatch) parsedData.phone = phoneMatch[1];
                    if (emailMatch) parsedData.email = emailMatch[1];
                    break;
                // Add more parsing for other types as needed
                default:
                    break;
            }
        } catch (error) {
            console.error('Error parsing QR content:', error);
        }

        setQrData(parsedData);
    }, []);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDataChange = (key: string, value: any) => {
        setQrData((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCustomizationChange = (key: keyof QRCustomization, value: string | number | boolean) => {
        setCustomization((prev) => {
            // If the user changes the size (width), always mirror it to height so output stays square
            if (key === 'width' && typeof value === 'number' && !Number.isNaN(value)) {
                return { ...prev, width: value, height: value };
            }

            return { ...prev, [key]: value } as Partial<QRCustomization>;
        });
    };

    const handleApplyBrandKit = (kit: BrandKit) => {
        setCustomization(kit.config);
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
                    const body = qrData.message ? `?body=${encodeURIComponent(qrData.message)}` : '';
                    return `SMSTO:${num}:${qrData.message || ''}` || `sms:${num}${body}`;
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
                    // Basic VEVENT minimal
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

    const permalink = useMemo(() => {
        return qrCode.permalink || '';
    }, [qrCode.permalink]);

    const qrContent = useMemo(() => {
        if (!selectedType) return '';

        if (mode === 'dynamic' && permalink) {
            return permalink;
        }

        return encodeData;
    }, [selectedType, mode, permalink, encodeData]);

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

    const handleSubmit = () => {
        if (!selectedType || !encodeData) {
            return;
        }

        const design = {
            foreground_color: customization.dotsColor || '#000000',
            background_color: customization.backgroundColor || '#ffffff',
            pattern: (() => {
                const t = customization.dotsType || 'square';
                if (t === 'dots') return 'dots';
                if (t === 'rounded' || t === 'classy' || t === 'classy-rounded') return 'rounded';
                return 'square';
            })(),
            error_correction: customization.errorCorrectionLevel || 'M',
        };

        const destinationUrl = selectedType === 'url' && qrData.url ? qrData.url : null;
        const finalContent = qrContent || encodeData;

        router.put(route('qr-codes.update', qrCode.id), {
            name,
            description,
            content: finalContent,
            destination_url: destinationUrl,
            design,
            customization,
            folder_id: selectedFolderId === 'none' ? null : parseInt(selectedFolderId),
            tags: selectedTagIds,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Edit QR Code
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Update your QR code settings and design
                    </p>
                </div>
            }
        >
            <Head title="Edit QR Code" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/qr-codes/${qrCode.id}`}>
                                ← Back to QR Details
                            </Link>
                        </Button>
                        {/* Sticky Navigation */} 
                        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 border-b">
                            <div className="flex items-center justify-center space-x-8">
                                {[
                                    { id: 'details', label: '1. Details' },
                                    { id: 'configure', label: '2. Configure' },
                                    { id: 'customize', label: '3. Customize' },
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

                        {/* Section 1: QR Details */}
                        <div id="details" className="scroll-mt-24 space-y-6">
                            <h3 className="text-2xl font-bold">1. QR Details</h3>

                            <Card>
                                <CardHeader>
                                    <CardTitle>QR Configuration</CardTitle>
                                    <CardDescription>
                                        Update the basic details of your QR code.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="qr-name">QR Name</Label>
                                                <Input
                                                    id="qr-name"
                                                    placeholder="e.g. Fall Campaign Landing Page"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Optional label to help you recognize this QR in your dashboard.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="qr-description">Description</Label>
                                                <Textarea
                                                    id="qr-description"
                                                    placeholder="Internal notes about where this QR will be used."
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="folder">Folder</Label>
                                                <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a folder" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">No Folder</SelectItem>
                                                        {flatFolders.map((folder) => (
                                                            <SelectItem key={folder.id} value={folder.id.toString()}>
                                                                <span style={{ paddingLeft: `${folder.depth * 10}px` }}>
                                                                    {folder.name}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tags</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag) => (
                                                        <Badge
                                                            key={tag.id}
                                                            variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                                                            className="cursor-pointer"
                                                            onClick={() => toggleTag(tag.id)}
                                                            style={selectedTagIds.includes(tag.id) && tag.color ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                    {tags.length === 0 && (
                                                        <span className="text-sm text-muted-foreground">No tags available.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label>Type (Locked)</Label>
                                                <div className="flex items-center gap-3 p-3 bg-muted rounded-md border">
                                                    <div className="text-2xl">
                                                        {qrTypes.find(t => t.type === selectedType)?.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {qrTypes.find(t => t.type === selectedType)?.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            QR type cannot be changed after creation
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Mode (Locked)</Label>
                                                <div className="p-3 bg-muted rounded-md border">
                                                    <Badge variant={mode === 'dynamic' ? 'default' : 'secondary'}>
                                                        {mode === 'dynamic' ? 'Dynamic' : 'Static'}
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Mode cannot be changed after creation
                                                    </p>
                                                </div>
                                            </div>
                                            {mode === 'dynamic' && permalink && (
                                                <div className="space-y-1">
                                                    <Label>Permalink</Label>
                                                    <div className="rounded border bg-muted px-2 py-1 text-xs font-mono break-all">
                                                        {permalink}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-12">
                                {/* Section 2: Configure */}
                                <div id="configure" className="scroll-mt-24 space-y-6">
                                    <h3 className="text-2xl font-bold">2. Configure Content</h3>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Configure {qrTypes.find(t => t.type === selectedType)?.title}
                                            </CardTitle>
                                            <CardDescription>
                                                Update the content for your QR code
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {renderForm()}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Section 3: Customize */}
                                <div id="customize" className="scroll-mt-24 space-y-6">
                                    <h3 className="text-2xl font-bold">3. Customize Design</h3>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Design Options</CardTitle>
                                            <CardDescription>
                                                Update your QR code appearance
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Brand Kit Selector */}
                                            {brandKits && brandKits.length > 0 && (
                                                <div className="mb-6 pb-6 border-b">
                                                    <Label className="mb-3 block">Apply Brand Kit</Label>
                                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                                        {brandKits.map((kit) => (
                                                            <Card
                                                                key={kit.id}
                                                                className="flex-shrink-0 w-40 cursor-pointer hover:border-primary transition-colors"
                                                                onClick={() => handleApplyBrandKit(kit)}
                                                            >
                                                                <CardContent className="p-4">
                                                                    <div className="space-y-2">
                                                                        <p className="font-medium text-sm truncate">{kit.name}</p>
                                                                        <div className="flex gap-1">
                                                                            <div
                                                                                className="w-6 h-6 rounded border"
                                                                                style={{ backgroundColor: kit.config.dotsColor || '#000' }}
                                                                                title="Dots Color"
                                                                            />
                                                                            <div
                                                                                className="w-6 h-6 rounded border"
                                                                                style={{ backgroundColor: kit.config.backgroundColor || '#fff' }}
                                                                                title="Background Color"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <CustomizeForm
                                                qrData={qrData}
                                                customization={customization}
                                                onCustomizationChange={handleCustomizationChange}
                                            />
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            size="lg" 
                                            disabled={!selectedType || !encodeData}
                                            className="w-full sm:w-auto"
                                            onClick={handleSubmit}
                                        >
                                            Update QR Code
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
                                            <div className="w-full">
                                                <QRCodePreview data={qrContent} customization={customization} />
                                            </div>
                                            <p className="mt-4 text-xs text-muted-foreground text-center">
                                                {qrTypes.find(t => t.type === selectedType)?.title} QR Code
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
