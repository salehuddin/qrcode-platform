import { Label } from '@/Components/ui/label';
import { QRCustomization } from '@/types';
import { cn } from '@/lib/utils';

interface PatternCustomizerProps {
    customization: Partial<QRCustomization>;
    onChange: (key: keyof QRCustomization, value: string | number | boolean) => void;
}

export function PatternCustomizer({ customization, onChange }: PatternCustomizerProps) {
    const dotsTypeOptions = ['square', 'rounded', 'dots', 'classy', 'classy-rounded'] as const;
    const cornersTypeOptions = ['square', 'dot'] as const;

    return (
        <div className="space-y-6">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Patterns & Styles</h4>
            
            {/* Dots Type */}
            <div className="space-y-3">
                <Label>Dots Pattern</Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {dotsTypeOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => onChange('dotsType', type)}
                            className={cn(
                                'px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                                customization.dotsType === type
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input hover:border-primary/50'
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">Choose how the QR dots look</p>
            </div>

            {/* Corner Squares Type */}
            <div className="space-y-3">
                <Label>Corner Squares</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                    {cornersTypeOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => onChange('cornersSquareType', type)}
                            className={cn(
                                'px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                                customization.cornersSquareType === type
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input hover:border-primary/50'
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">Style for the corner squares</p>
            </div>

            {/* Corner Dots Type */}
            <div className="space-y-3">
                <Label>Corner Dots</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                    {cornersTypeOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => onChange('cornersDotsType', type)}
                            className={cn(
                                'px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                                customization.cornersDotsType === type
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input hover:border-primary/50'
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">Style for the corner dots</p>
            </div>

            {/* Error Correction Level */}
            <div className="space-y-3">
                <Label htmlFor="errorLevel">Error Correction Level</Label>
                <select
                    id="errorLevel"
                    value={customization.errorCorrectionLevel || 'M'}
                    onChange={(e) => onChange('errorCorrectionLevel', e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                </select>
                <p className="text-xs text-muted-foreground">Higher levels allow more error recovery but reduce data capacity</p>
            </div>
        </div>
    );
}