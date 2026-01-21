import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { useToast } from '@/Components/ui/use-toast';

interface NotificationPreference {
    type: string;
    description: string | null;
    system_enabled: boolean;
    user_enabled: boolean;
    can_change: boolean;
}

interface Props extends PageProps {
    preferences: NotificationPreference[];
}

export default function NotificationPreferences({ auth, preferences }: Props) {
    const { toast } = useToast();

    const handleToggle = (notificationType: string, currentValue: boolean, canChange: boolean) => {
        if (!canChange) {
            toast({
                title: 'Not Available',
                description: 'This notification type is disabled system-wide by administrators.',
                variant: 'destructive',
            });
            return;
        }

        router.put(
            route('settings.notifications.update'),
            {
                notification_type: notificationType,
                is_enabled: !currentValue,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: `Notification ${!currentValue ? 'enabled' : 'disabled'} successfully!`,
                    });
                },
                onError: (errors: any) => {
                    toast({
                        title: 'Error',
                        description: errors.message || 'Failed to update notification preference.',
                        variant: 'destructive',
                    });
                },
            }
        );
    };

    const getNotificationLabel = (type: string): string => {
        const labels: Record<string, string> = {
            welcome: 'Welcome Email',
            password_reset: 'Password Reset',
            scan_alert: 'QR Scan Alerts',
            subscription_payment_success: 'Payment Confirmation',
            subscription_renewal: 'Subscription Renewal',
            subscription_payment_failed: 'Payment Failed Alert',
            activity_member_joined: 'Member Joined',
            activity_member_removed: 'Member Removed',
            activity_role_changed: 'Role Changed',
            export_ready: 'Export Ready',
        };
        return labels[type] || type;
    };

    const getNotificationCategory = (type: string): string => {
        if (type.startsWith('subscription_')) return 'Billing & Subscriptions';
        if (type.startsWith('activity_')) return 'Team Activity';
        if (type === 'welcome' || type === 'password_reset') return 'Account';
        if (type === 'scan_alert') return 'QR Code Analytics';
        if (type === 'export_ready') return 'QR Code Management';
        return 'Other';
    };

    // Group preferences by category
    const groupedPreferences = preferences.reduce((acc, pref) => {
        const category = getNotificationCategory(pref.type);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(pref);
        return acc;
    }, {} as Record<string, NotificationPreference[]>);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Notification Preferences</h2>}
        >
            <Head title="Notification Preferences" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Notification Preferences</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage which email notifications you want to receive. You can opt-out of any notification type.
                        </p>
                    </div>

                    {/* Notification Categories */}
                    {Object.entries(groupedPreferences).map(([category, categoryPreferences]) => (
                        <Card key={category}>
                            <CardHeader>
                                <CardTitle>{category}</CardTitle>
                                <CardDescription>
                                    Control {category.toLowerCase()} email notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {categoryPreferences.map((pref) => (
                                    <div
                                        key={pref.type}
                                        className="flex items-center justify-between space-x-4 pb-6 border-b last:border-0 last:pb-0"
                                    >
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Label
                                                    htmlFor={`pref-${pref.type}`}
                                                    className={`text-base font-medium ${
                                                        pref.can_change ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                                    }`}
                                                >
                                                    {getNotificationLabel(pref.type)}
                                                </Label>
                                                {!pref.system_enabled && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                        Disabled by admin
                                                    </span>
                                                )}
                                            </div>
                                            {pref.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {pref.description}
                                                </p>
                                            )}
                                        </div>
                                        <Switch
                                            id={`pref-${pref.type}`}
                                            checked={pref.user_enabled && pref.system_enabled}
                                            disabled={!pref.can_change}
                                            onCheckedChange={() =>
                                                handleToggle(pref.type, pref.user_enabled, pref.can_change)
                                            }
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Info Card */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="text-2xl">💡</div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">About Notification Preferences</p>
                                    <p className="text-sm text-muted-foreground">
                                        You can opt-out of any notification type at any time. Some notifications may be disabled
                                        system-wide by administrators. You'll still receive critical account security notifications
                                        regardless of these settings.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
