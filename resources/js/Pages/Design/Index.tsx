import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { CustomizeForm } from '../QRCode/Partials/CustomizeForm';
import { QRCodePreview } from '../QRCode/Partials/QRCodePreview';
import { useState } from 'react';
import { QRCustomization } from '@/types';
import { Save, LayoutTemplate, Palette, Trash2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface Template {
    id: number;
    name: string;
    thumbnail: string | null;
    config: QRCustomization;
    category: string;
}

interface BrandKit {
    id: number;
    name: string;
    config: QRCustomization;
    is_default: boolean;
}

interface DesignIndexProps {
    templates: Template[];
    brandKits: BrandKit[];
    isAdmin: boolean;
}

export default function DesignIndex({ templates, brandKits, isAdmin }: DesignIndexProps) {
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

    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [brandKitName, setBrandKitName] = useState('');
    const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [templateCategory, setTemplateCategory] = useState('');

    const handleCustomizationChange = (key: keyof QRCustomization, value: string | number | boolean) => {
        setCustomization((prev) => {
            if (key === 'width' && typeof value === 'number' && !Number.isNaN(value)) {
                return { ...prev, width: value, height: value };
            }
            return { ...prev, [key]: value } as Partial<QRCustomization>;
        });
    };

    const handleSaveBrandKit = () => {
        if (!brandKitName.trim()) return;

        router.post(route('design.brand-kits.store'), {
            name: brandKitName,
            config: customization,
        }, {
            onSuccess: () => {
                setIsSaveModalOpen(false);
                setBrandKitName('');
            },
        });
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim() || !templateCategory.trim()) return;

        router.post(route('design.templates.store'), {
            name: templateName,
            category: templateCategory,
            config: customization,
        }, {
            onSuccess: () => {
                setIsSaveTemplateModalOpen(false);
                setTemplateName('');
                setTemplateCategory('');
            },
        });
    };

    const handleDeleteBrandKit = (id: number) => {
        if (confirm('Are you sure you want to delete this brand kit?')) {
            router.delete(route('design.brand-kits.destroy', id));
        }
    };

    const applyDesign = (config: QRCustomization) => {
        setCustomization(config);
    };

    // Mock data for preview
    const previewData = "https://example.com/design-studio-preview";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Design Studio
                </h2>
            }
        >
            <Head title="Design Studio" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left Column: Controls */}
                        <div className="lg:col-span-2 space-y-6">
                            <Tabs defaultValue="customizer" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="customizer">
                                        <Palette className="mr-2 h-4 w-4" />
                                        Customizer
                                    </TabsTrigger>
                                    <TabsTrigger value="templates">
                                        <LayoutTemplate className="mr-2 h-4 w-4" />
                                        Templates
                                    </TabsTrigger>
                                    <TabsTrigger value="brand-kits">
                                        <Save className="mr-2 h-4 w-4" />
                                        Brand Kits
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="customizer" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>QR Code Styler</CardTitle>
                                            <CardDescription>
                                                Customize every aspect of your QR code design.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <CustomizeForm
                                                qrData={{}}
                                                customization={customization}
                                                onCustomizationChange={handleCustomizationChange}
                                            />
                                        </CardContent>
                                    </Card>
                                    
                                    <div className="flex justify-end gap-4">
                                        <Button 
                                            variant="outline"
                                            onClick={() => setCustomization({
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
                                            })}
                                        >
                                            Reset to Default
                                        </Button>
                                        
                                        <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save as Brand Kit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Save Brand Kit</DialogTitle>
                                                    <DialogDescription>
                                                        Save your current design settings as a reusable brand kit.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            value={brandKitName}
                                                            onChange={(e) => setBrandKitName(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="e.g., Marketing Campaign"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleSaveBrandKit}>
                                                        Save Brand Kit
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        {isAdmin && (
                                            <Dialog open={isSaveTemplateModalOpen} onOpenChange={setIsSaveTemplateModalOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="secondary">
                                                        <LayoutTemplate className="mr-2 h-4 w-4" />
                                                        Save as Template
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Save Template</DialogTitle>
                                                        <DialogDescription>
                                                            Save your current design as a template for all users.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="template-name" className="text-right">
                                                                Name
                                                            </Label>
                                                            <Input
                                                                id="template-name"
                                                                value={templateName}
                                                                onChange={(e) => setTemplateName(e.target.value)}
                                                                className="col-span-3"
                                                                placeholder="e.g., Modern Gradient"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="template-category" className="text-right">
                                                                Category
                                                            </Label>
                                                            <Input
                                                                id="template-category"
                                                                value={templateCategory}
                                                                onChange={(e) => setTemplateCategory(e.target.value)}
                                                                className="col-span-3"
                                                                placeholder="e.g., Business, Creative"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setIsSaveTemplateModalOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleSaveTemplate}>
                                                            Save Template
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="templates">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Templates</CardTitle>
                                            <CardDescription>
                                                Choose from professionally designed templates.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {templates.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {templates.map((template) => (
                                                        <div 
                                                            key={template.id} 
                                                            className="group relative border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                                                            onClick={() => applyDesign(template.config)}
                                                        >
                                                            <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                                                                {/* In a real app, render a thumbnail image or a small QR preview */}
                                                                <QRCodePreview data="TEMPLATE" customization={template.config} />
                                                            </div>
                                                            <p className="font-medium text-sm text-center">{template.name}</p>
                                                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                                <Button size="sm" variant="secondary">Apply</Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <LayoutTemplate className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                                    <p>No templates available yet.</p>
                                                    {isAdmin && (
                                                        <p className="text-xs mt-2">Create templates from the Customizer tab.</p>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="brand-kits">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Brand Kits</CardTitle>
                                            <CardDescription>
                                                Your saved design presets.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {brandKits.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {brandKits.map((kit) => (
                                                        <div key={kit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                                                                    <Palette className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">{kit.name}</h4>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {kit.is_default ? 'Default' : 'Custom'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline"
                                                                    onClick={() => applyDesign(kit.config)}
                                                                >
                                                                    Apply
                                                                </Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    className="text-destructive hover:text-destructive"
                                                                    onClick={() => handleDeleteBrandKit(kit.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <Save className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                                    <p>No brand kits saved yet. Create one from the Customizer tab.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right Column: Preview */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-4">
                                <Card className="border-2 border-primary/20 overflow-hidden">
                                    <CardHeader className="bg-muted/50 pb-4">
                                        <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center p-8 bg-white">
                                        <div className="w-full aspect-square relative flex items-center justify-center">
                                            <QRCodePreview data={previewData} customization={customization} />
                                        </div>
                                        <p className="mt-4 text-xs text-muted-foreground text-center">
                                            Previewing with sample data
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
