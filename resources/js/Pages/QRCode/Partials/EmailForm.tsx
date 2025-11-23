import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export interface EmailFormData {
    email: string;
    subject: string;
    body: string;
}

interface EmailFormProps {
    data: EmailFormData;
    onChange: (key: keyof EmailFormData, value: string) => void;
}

export function EmailForm({ data, onChange }: EmailFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="recipient@example.com"
                    value={data.email || ''}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    placeholder="Email Subject"
                    value={data.subject || ''}
                    onChange={(e) => onChange('subject', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="body">Message Body</Label>
                <Textarea
                    id="body"
                    placeholder="Your email message"
                    value={data.body || ''}
                    onChange={(e) => onChange('body', e.target.value)}
                />
            </div>
        </div>
    );
}