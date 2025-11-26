import { Label } from '@/Components/ui/label';
import { QRCustomization } from '@/types';
import { useState } from 'react';

interface LogoUploaderProps {
    customization: Partial<QRCustomization>;
    onChange: (key: keyof QRCustomization, value: string | number | boolean) => void;
}

export function LogoUploader({ customization, onChange }: LogoUploaderProps) {
    const [preview, setPreview] = useState<string | null>(customization.image ? String(customization.image) : null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (PNG, JPG, GIF, or SVG)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setPreview(base64);
            onChange('image', base64);
        };
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        setPreview(null);
        onChange('image', '');
    };

    return (
        <div className="space-y-6">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Logo</h4>

            <div className="space-y-3">
                <Label htmlFor="logoUpload">Upload Logo Image</Label>
                <input
                    id="logoUpload"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90
                        cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                    Supported formats: PNG, JPG, GIF, SVG (max 2MB)
                </p>
            </div>

            {/* Logo Preview */}
            {preview && (
                <div className="space-y-3">
                    <Label>Logo Preview</Label>
                    <div className="border border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/20">
                        <img src={preview} alt="Logo preview" className="max-w-48 max-h-48 object-contain" />
                    </div>
                    <button
                        onClick={removeLogo}
                        className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                    >
                        Remove Logo
                    </button>
                </div>
            )}

            {/* Logo Size */}
            <div className="space-y-3">
                <Label htmlFor="logoSize">Logo Size</Label>
                <div className="space-y-2">
                    <input
                        id="logoSize"
                        type="range"
                        min="0.1"
                        max="0.4"
                        step="0.05"
                        value={customization.imageSize || 0.2}
                        onChange={(e) => onChange('imageSize', parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                        Size: {Math.round((customization.imageSize || 0.2) * 100)}% of QR code
                    </p>
                </div>
            </div>
        </div>
    );
}