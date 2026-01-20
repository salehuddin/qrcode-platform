import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';

interface PreferencesProps {
    settings: {
        theme: 'light' | 'dark' | 'system';
        font_size: 'small' | 'normal' | 'large';
        compact_mode: boolean;
        default_date_range: '7days' | '30days' | 'month' | 'year';
    };
}

export default function Preferences({ settings }: PreferencesProps) {
    const { data, setData, patch, processing, errors } = useForm({
        theme: settings.theme || 'system',
        font_size: settings.font_size || 'normal',
        compact_mode: settings.compact_mode || false,
        default_date_range: settings.default_date_range || '30days',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('preferences.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    User Preferences
                </h2>
            }
        >
            <Head title="Preferences" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Appearance Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>
                                    Customize how the application looks
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Theme */}
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select
                                        value={data.theme}
                                        onValueChange={(value) => setData('theme', value as any)}
                                    >
                                        <SelectTrigger id="theme">
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your preferred color scheme
                                    </p>
                                </div>

                                <Separator />

                                {/* Font Size */}
                                <div className="space-y-2">
                                    <Label htmlFor="font_size">Font Size</Label>
                                    <Select
                                        value={data.font_size}
                                        onValueChange={(value) => setData('font_size', value as any)}
                                    >
                                        <SelectTrigger id="font_size">
                                            <SelectValue placeholder="Select font size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="small">Small</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="large">Large</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Adjust text size across the application
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interface Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Interface</CardTitle>
                                <CardDescription>
                                    Adjust layout and spacing preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="compact_mode">Compact Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Reduce spacing in lists and cards
                                        </p>
                                    </div>
                                    <Switch
                                        id="compact_mode"
                                        checked={data.compact_mode}
                                        onCheckedChange={(checked) => setData('compact_mode', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Analytics Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>
                                    Set default preferences for analytics views
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="default_date_range">Default Date Range</Label>
                                    <Select
                                        value={data.default_date_range}
                                        onValueChange={(value) => setData('default_date_range', value as any)}
                                    >
                                        <SelectTrigger id="default_date_range">
                                            <SelectValue placeholder="Select default range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7days">Last 7 Days</SelectItem>
                                            <SelectItem value="30days">Last 30 Days</SelectItem>
                                            <SelectItem value="month">This Month</SelectItem>
                                            <SelectItem value="year">This Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Default time range when viewing analytics
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Save Preferences
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
