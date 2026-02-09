import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export interface PhoneFormData {
    number: string;
}

interface PhoneFormProps {
    data: PhoneFormData;
    onChange: (key: keyof PhoneFormData, value: string) => void;
}

export function PhoneForm({ data, onChange }: PhoneFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={data.number || ''}
                    onChange={(e) => onChange('number', e.target.value)}
                />
            </div>
        </div>
    );
}