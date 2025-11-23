import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { cn } from "@/lib/utils";

export interface WifiFormData {
    ssid: string;
    password?: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
}

interface WifiFormProps {
    data: WifiFormData;
    onChange: (key: keyof WifiFormData, value: any) => void;
}

export function WifiForm({ data, onChange }: WifiFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ssid">Network Name (SSID)</Label>
                <Input
                    id="ssid"
                    placeholder="MyWiFiNetwork"
                    value={data.ssid || ''}
                    onChange={(e) => onChange('ssid', e.target.value)}
                    required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <select
                    id="encryption"
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    value={data.encryption || 'WPA'}
                    onChange={(e) => onChange('encryption', e.target.value)}
                >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Encryption</option>
                </select>
            </div>

            {data.encryption !== 'nopass' && (
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Wireless Key"
                        value={data.password || ''}
                        onChange={(e) => onChange('password', e.target.value)}
                    />
                </div>
            )}

            <div className="flex items-center space-x-2">
                 <input
                    type="checkbox"
                    id="hidden"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={data.hidden || false}
                    onChange={(e) => onChange('hidden', e.target.checked)}
                />
                <Label htmlFor="hidden">Hidden Network</Label>
            </div>
        </div>
    );
}