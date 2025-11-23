import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export interface VCardFormData {
    firstName: string;
    lastName: string;
    organization: string;
    phone: string;
    email: string;
    website: string;
}

interface VCardFormProps {
    data: VCardFormData;
    onChange: (key: keyof VCardFormData, value: string) => void;
}

export function VCardForm({ data, onChange }: VCardFormProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    placeholder="John"
                    value={data.firstName || ''}
                    onChange={(e) => onChange('firstName', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    placeholder="Doe"
                    value={data.lastName || ''}
                    onChange={(e) => onChange('lastName', e.target.value)}
                />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                    id="organization"
                    placeholder="Company Ltd."
                    value={data.organization || ''}
                    onChange={(e) => onChange('organization', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={data.phone || ''}
                    onChange={(e) => onChange('phone', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={data.email || ''}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={data.website || ''}
                    onChange={(e) => onChange('website', e.target.value)}
                />
            </div>
        </div>
    );
}