import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, QRCodeType, QRCustomization, QRCodeMode, BrandKit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { useMemo, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

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

interface Folder {
    id: number;
    name: string;
    children: Folder[];
    parent_id?: number | null;
}

interface Tag {
    id: number;
    name: string;
    color: string | null;
}

interface Team {
    id: number;
    name: string;
}

interface Props extends PageProps {
    folders: Folder[];
    tags: Tag[];
    teams: Team[];
    brandKits: BrandKit[];
}

export default function CreateQRCode({ folders, tags, teams, brandKits }: Props) {
    const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
    const [mode, setMode] = useState<QRCodeMode>('dynamic');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permalinkSlug, setPermalinkSlug] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<string>('none');
    const [selectedTeamId, setSelectedTeamId] = useState<string>('none');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
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
                    return `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:${summary}\nLOCATION:${location}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nEND:VEVENT\nEND:VCALENDAR`;
                }
                case 'vcard': {
                    const first = qrData.firstName || '';
                    const last = qrData.lastName || '';
                    const phone = qrData.phone || '';
                    const email = qrData.email || '';
                    const org = qrData.organization || '';
                    const title = qrData.title || '';
                    return `BEGIN:VCARD\nVERSION:3.0\nN:${last};${first};;;\nFN:${first} ${last}\nORG:${org}\nTITLE:${title}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
                }
                default:
                    return '';
            }
        } catch {
            return '';
        }
    }, [selectedType, qrData]);

    const permalink = useMemo(() => {
        if (mode !== 'dynamic') return '';

        const baseUrl = window.location.origin;
        const slug = permalinkSlug || (
            name
                ? name
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                : 'new-qr'
        );

        return `${baseUrl}/r/${slug}`;
    }, [mode, name, permalinkSlug]);

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

        const slug = permalinkSlug || (
            name
                ? name
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                : 'new-qr'
        );

        router.post(route('qr-codes.store'), {
            name,
            description,
            mode,
            type: selectedType,
            content: finalContent,
            permalink: mode === 'dynamic' ? slug : null,
            destination_url: destinationUrl,
            design,
            customization,
            folder_id: selectedFolderId === 'none' ? null : selectedFolderId,
            team_id: selectedTeamId === 'none' ? null : selectedTeamId,
            tags: selectedTagIds,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Create QR Code
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Create and customize your static or dynamic QR code
                    </p>
                </div>
            }
        >
            <Head title="Create QR Code" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/qr-codes">
                                ← Back to QR Codes
                            </Link>
                        </Button>
                        {/* Sticky Navigation */} 
                        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 border-b">
                            <div className="flex items-center justify-center space-x-8">
                                {[
                                    { id: 'details', label: '1. Details & Mode' },
                                    { id: 'select-type', label: '2. Select Type' },
                                    { id: 'configure', label: '3. Configure' },
                                    { id: 'customize', label: '4. Customize' },
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

                        {/* Section 1: QR Details & Mode */}
                        <div id="details" className="scroll-mt-24 space-y-6">
                            <h3 className="text-2xl font-bold">1. QR Details &amp; Mode</h3>

                            <Card>
                                <CardHeader>
                                    <CardTitle>QR Configuration</CardTitle>
                                    <CardDescription>
                                        Set up the basics of your QR before choosing its type and content.
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
                                                <Label>Mode</Label>
                                                <div className="inline-flex items-center rounded-md border bg-muted/40 p-1 text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => setMode('dynamic')}
                                                        className={`rounded-sm px-3 py-1 font-medium transition-colors ${
                                                            mode === 'dynamic'
                                                                ? 'bg-primary text-primary-foreground shadow'
                                                                : 'text-muted-foreground hover:bg-background'
                                                        }`}
                                                    >
                                                        Dynamic (recommended)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMode('static')}
                                                        className={`rounded-sm px-3 py-1 font-medium transition-colors ${
                                                            mode === 'static'
                                                                ? 'bg-primary text-primary-foreground shadow'
                                                                : 'text-muted-foreground hover:bg-background'
                                                        }`}
                                                    >
                                                        Static
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Dynamic QR encodes a short permalink you can update later. Static QR encodes the content directly.
                                                </p>
                                            </div>
                                            {mode === 'dynamic' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="permalink-slug">Custom Permalink</Label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{window.location.origin}/r/</span>
                                                        <Input
                                                            id="permalink-slug"
                                                            placeholder={name ? name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'new-qr'}
                                                            value={permalinkSlug}
                                                            onChange={(e) => {
                                                                const value = e.target.value
                                                                    .toLowerCase()
                                                                    .replace(/[^a-z0-9-]/g, '')
                                                                    .replace(/^-+|-+$/g, '');
                                                                setPermalinkSlug(value);
                                                            }}
                                                            className="text-xs font-mono"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Leave empty to auto-generate from QR name
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Section 2: Select Type */}
                        <div id="select-type" className="scroll-mt-24 space-y-6">
                            <h3 className="text-2xl font-bold">2. Select QR Code Type</h3>
                            
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
                                {/* Section 3: Configure */}
                                <div id="configure" className="scroll-mt-24 space-y-6">
                                    <h3 className="text-2xl font-bold">3. Configure Content</h3>
                                    
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
                                            {selectedType ? (
                                                renderForm()
                                            ) : (
                                                <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                                                    <p className="text-muted-foreground">No type selected</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Section 4: Customize */}
                                <div id="customize" className="scroll-mt-24 space-y-6">
                                    <h3 className="text-2xl font-bold">4. Customize Design</h3>
                                    
                                    <Card className={!selectedType ? "opacity-50 pointer-events-none" : ""}>
                                        <CardHeader>
                                            <CardTitle>Design Options</CardTitle>
                                            <CardDescription>
                                                Make your QR code unique
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {selectedType ? (
                                                <>
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
                                                </>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-muted-foreground">Select a type and configure content first.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            size="lg" 
                                            disabled={!selectedType || !encodeData}
                                            className="w-full sm:w-auto"
                                            onClick={handleSubmit}
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
                                            <div className="w-full">
                                                <QRCodePreview data={qrContent} customization={customization} />
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
