import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export interface EventFormData {
    title: string;
    location: string;
    start: string;
    end: string;
    description: string;
}

interface EventFormProps {
    data: EventFormData;
    onChange: (key: keyof EventFormData, value: string) => void;
}

export function EventForm({ data, onChange }: EventFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                    id="title"
                    placeholder="Annual Conference"
                    value={data.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    placeholder="Conference Center, Room A"
                    value={data.location || ''}
                    onChange={(e) => onChange('location', e.target.value)}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="start">Start Date & Time</Label>
                    <Input
                        id="start"
                        type="datetime-local"
                        value={data.start || ''}
                        onChange={(e) => onChange('start', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end">End Date & Time</Label>
                    <Input
                        id="end"
                        type="datetime-local"
                        value={data.end || ''}
                        onChange={(e) => onChange('end', e.target.value)}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Event details..."
                    value={data.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                />
            </div>
        </div>
    );
}