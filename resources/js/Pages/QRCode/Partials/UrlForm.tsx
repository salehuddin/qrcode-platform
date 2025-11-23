import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export interface UrlFormData {
    url: string;
}

interface UrlFormProps {
    data: UrlFormData;
    onChange: (key: keyof UrlFormData, value: string) => void;
}

export function UrlForm({ data, onChange }: UrlFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                    id="url"
                    placeholder="https://example.com"
                    value={data.url || ''}
                    onChange={(e) => onChange('url', e.target.value)}
                    type="url"
                    required
                />
                <p className="text-sm text-muted-foreground">
                    Enter the URL you want the QR code to link to.
                </p>
            </div>
        </div>
    );
}