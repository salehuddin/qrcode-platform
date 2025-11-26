import { Label } from '@/Components/ui/label';
import { QRCustomization } from '@/types';

interface ColorCustomizerProps {
    customization: Partial<QRCustomization>;
    onChange: (key: keyof QRCustomization, value: string | number | boolean) => void;
}

export function ColorCustomizer({ customization, onChange }: ColorCustomizerProps) {
    const colors = [
        { label: 'Dots Color', key: 'dotsColor' as const, description: 'Color of the QR code dots' },
        { label: 'Background Color', key: 'backgroundColor' as const, description: 'Background color' },
        { label: 'Corner Squares Color', key: 'cornersSquareColor' as const, description: 'Corner squares color' },
        { label: 'Corner Dots Color', key: 'cornersDotsColor' as const, description: 'Corner dots color' },
    ];

    return (
        <div className="space-y-6">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Colors</h4>
            <div className="grid gap-6 md:grid-cols-2">
                {colors.map((color) => (
                    <div key={color.key} className="space-y-2">
                        <Label htmlFor={color.key}>{color.label}</Label>
                        <div className="flex items-center gap-3">
                            <input
                                id={color.key}
                                type="color"
                                value={customization[color.key] || '#000000'}
                                onChange={(e) => onChange(color.key, e.target.value)}
                                className="h-10 w-16 rounded border border-input cursor-pointer"
                            />
                            <input
                                type="text"
                                value={customization[color.key] || '#000000'}
                                onChange={(e) => onChange(color.key, e.target.value)}
                                placeholder="#000000"
                                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">{color.description}</p>
                    </div>
                ))}
            </div>

            {/* Dots Gradient */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Dots Gradient</h4>
                <div className="flex items-center gap-2">
                    <input
                        id="dots-gradient-enabled"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={Boolean(customization.gradientEnabled)}
                        onChange={(e) => onChange('gradientEnabled', e.target.checked)}
                    />
                    <Label htmlFor="dots-gradient-enabled" className="text-sm">
                        Enable gradient for dots
                    </Label>
                </div>
                {customization.gradientEnabled && (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="gradientStartColor">Start Color</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="gradientStartColor"
                                        type="color"
                                        value={customization.gradientStartColor || customization.dotsColor || '#000000'}
                                        onChange={(e) => onChange('gradientStartColor', e.target.value)}
                                        className="h-10 w-16 rounded border border-input cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customization.gradientStartColor || customization.dotsColor || '#000000'}
                                        onChange={(e) => onChange('gradientStartColor', e.target.value)}
                                        placeholder="#000000"
                                        className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradientEndColor">End Color</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="gradientEndColor"
                                        type="color"
                                        value={customization.gradientEndColor || customization.dotsColor || '#000000'}
                                        onChange={(e) => onChange('gradientEndColor', e.target.value)}
                                        className="h-10 w-16 rounded border border-input cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customization.gradientEndColor || customization.dotsColor || '#000000'}
                                        onChange={(e) => onChange('gradientEndColor', e.target.value)}
                                        placeholder="#000000"
                                        className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gradientRotation">Angle</Label>
                            <input
                                id="gradientRotation"
                                type="range"
                                min="0"
                                max="360"
                                step="5"
                                value={typeof customization.gradientRotation === 'number' ? customization.gradientRotation : 0}
                                onChange={(e) => onChange('gradientRotation', parseInt(e.target.value, 10))}
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                                {typeof customization.gradientRotation === 'number' ? customization.gradientRotation : 0}°
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}