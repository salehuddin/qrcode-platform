import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export interface LocationFormData {
    latitude: string;
    longitude: string;
}

interface LocationFormProps {
    data: LocationFormData;
    onChange: (key: keyof LocationFormData, value: string) => void;
}

export function LocationForm({ data, onChange }: LocationFormProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                        id="latitude"
                        placeholder="40.7128"
                        value={data.latitude || ''}
                        onChange={(e) => onChange('latitude', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                        id="longitude"
                        placeholder="-74.0060"
                        value={data.longitude || ''}
                        onChange={(e) => onChange('longitude', e.target.value)}
                    />
                </div>
            </div>
            <p className="text-sm text-muted-foreground">
                Enter the GPS coordinates for the location. You can copy these from Google Maps.
            </p>
        </div>
    );
}