import { QRCustomization } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ColorCustomizer } from './ColorCustomizer';
import { PatternCustomizer } from './PatternCustomizer';
import { LogoUploader } from './LogoUploader';

interface CustomizeFormProps {
    qrData: any;
    customization: Partial<QRCustomization>;
    onCustomizationChange: (key: keyof QRCustomization, value: string | number | boolean) => void;
}

export function CustomizeForm({ qrData, customization, onCustomizationChange }: CustomizeFormProps) {
    const handleChange = (key: keyof QRCustomization, value: string | number | boolean) => {
        onCustomizationChange(key, value);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {/* Color Customization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Colors</CardTitle>
                        <CardDescription>
                            Customize the colors of your QR code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ColorCustomizer
                            customization={customization}
                            onChange={handleChange}
                        />
                    </CardContent>
                </Card>

                {/* Pattern Customization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patterns & Styles</CardTitle>
                        <CardDescription>
                            Choose dot patterns and corner styles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PatternCustomizer
                            customization={customization}
                            onChange={handleChange}
                        />
                    </CardContent>
                </Card>

                {/* Logo Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Logo</CardTitle>
                        <CardDescription>
                            Add a logo to the center of your QR code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LogoUploader
                            customization={customization}
                            onChange={handleChange}
                        />
                    </CardContent>
                </Card>

                {/* Size Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Size</CardTitle>
                        <CardDescription>
                            Set the output size of your QR code (preview stays constant)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Size (px)</label>
                            <input
                                type="number"
                                min="100"
                                max="1000"
                                step="50"
                                value={customization.width || 300}
                                onChange={(e) => handleChange('width', parseInt(e.target.value, 10))}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                This controls the exported image size. The on-screen preview always uses a fixed size.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
