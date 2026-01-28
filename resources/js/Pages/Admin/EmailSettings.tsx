import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useState } from 'react';
import { useToast } from '@/Components/ui/use-toast';

interface EmailConfig {
    id?: number;
    driver: string;
    host: string | null;
    port: number | null;
    username: string | null;
    password: string | null;
    encryption: string | null;
    from_address: string;
    from_name: string;
}

interface Props extends PageProps {
    currentConfig: EmailConfig | null;
    configStatus: {
        configured: boolean;
        driver: string;
        source: string;
    };
}

export default function EmailSettings({ auth, currentConfig, configStatus }: Props) {
    const { toast } = useToast();
    const [testEmail, setTestEmail] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        driver: currentConfig?.driver || 'smtp',
        host: currentConfig?.host || '',
        port: currentConfig?.port || 587,
        username: currentConfig?.username || '',
        password: '',
        encryption: currentConfig?.encryption || 'tls',
        from_address: currentConfig?.from_address || '',
        from_name: currentConfig?.from_name || 'QRCode Platform',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.email-settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Email settings updated successfully!',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to update email settings.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleTestEmail = () => {
        if (!testEmail) {
            toast({
                title: 'Error',
                description: 'Please enter a test email address.',
                variant: 'destructive',
            });
            return;
        }

        setIsTesting(true);
        // Use router.post instead of fetch to handle CSRF tokens automatically
        router.post(route('admin.email-settings.test'), { test_email: testEmail }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Test email sent! Check your inbox.',
                });
                setIsTesting(false);
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to send test email.',
                    variant: 'destructive',
                });
                setIsTesting(false);
            },
            onFinish: () => setIsTesting(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Email Settings" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Email Settings</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Configure SMTP settings for sending emails from the platform.
                        </p>
                    </div>

                    {/* Current Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Configuration</CardTitle>
                            <CardDescription>
                                Email configuration source: <strong>{configStatus.source}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Driver:</span>
                                    <span className="font-medium">{configStatus.driver}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={`font-medium ${configStatus.configured ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {configStatus.configured ? 'Configured' : 'Using .env defaults'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SMTP Configuration Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>SMTP Configuration</CardTitle>
                            <CardDescription>
                                Update email server settings. Leave password blank to keep existing password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Driver */}
                                <div className="space-y-2">
                                    <Label htmlFor="driver">Email Driver</Label>
                                    <Select value={data.driver} onValueChange={(value) => setData('driver', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="smtp">SMTP</SelectItem>
                                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                                            <SelectItem value="mailgun">Mailgun</SelectItem>
                                            <SelectItem value="ses">Amazon SES</SelectItem>
                                            <SelectItem value="log">Log (Development)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.driver && <p className="text-sm text-destructive">{errors.driver}</p>}
                                </div>

                                {/* Host */}
                                {data.driver === 'smtp' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="host">SMTP Host</Label>
                                            <Input
                                                id="host"
                                                value={data.host || ''}
                                                onChange={(e) => setData('host', e.target.value)}
                                                placeholder="smtp.gmail.com"
                                            />
                                            {errors.host && <p className="text-sm text-destructive">{errors.host}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="port">Port</Label>
                                                <Input
                                                    id="port"
                                                    type="number"
                                                    value={data.port || ''}
                                                    onChange={(e) => setData('port', parseInt(e.target.value))}
                                                    placeholder="587"
                                                />
                                                {errors.port && <p className="text-sm text-destructive">{errors.port}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="encryption">Encryption</Label>
                                                <Select value={data.encryption || 'tls'} onValueChange={(value) => setData('encryption', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="tls">TLS</SelectItem>
                                                        <SelectItem value="ssl">SSL</SelectItem>
                                                        <SelectItem value="null">None</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                value={data.username || ''}
                                                onChange={(e) => setData('username', e.target.value)}
                                                placeholder="your-email@gmail.com"
                                            />
                                            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Leave blank to keep existing"
                                            />
                                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                        </div>
                                    </>
                                )}

                                {/* From Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="from_address">From Email Address</Label>
                                    <Input
                                        id="from_address"
                                        type="email"
                                        value={data.from_address}
                                        onChange={(e) => setData('from_address', e.target.value)}
                                        placeholder="noreply@yourdomain.com"
                                        required
                                    />
                                    {errors.from_address && <p className="text-sm text-destructive">{errors.from_address}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="from_name">From Name</Label>
                                    <Input
                                        id="from_name"
                                        value={data.from_name}
                                        onChange={(e) => setData('from_name', e.target.value)}
                                        placeholder="QRCode Platform"
                                        required
                                    />
                                    {errors.from_name && <p className="text-sm text-destructive">{errors.from_name}</p>}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Test Email */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Email Configuration</CardTitle>
                            <CardDescription>
                                Send a test email to verify your configuration is working correctly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Input
                                    type="email"
                                    placeholder="test@example.com"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handleTestEmail} disabled={isTesting}>
                                    {isTesting ? 'Sending...' : 'Send Test Email'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
