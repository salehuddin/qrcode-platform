import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export interface SmsFormData {
    phone: string;
    message: string;
}

interface SmsFormProps {
    data: SmsFormData;
    onChange: (key: keyof SmsFormData, value: string) => void;
}

export function SmsForm({ data, onChange }: SmsFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={data.phone || ''}
                    onChange={(e) => onChange('phone', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    placeholder="Your message here"
                    value={data.message || ''}
                    onChange={(e) => onChange('message', e.target.value)}
                />
            </div>
        </div>
    );
}