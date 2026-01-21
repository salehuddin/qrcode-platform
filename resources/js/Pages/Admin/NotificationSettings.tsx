import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { useToast } from '@/Components/ui/use-toast';

interface NotificationSetting {
    id: number;
    notification_type: string;
    is_enabled: boolean;
    description: string | null;
}

interface Props extends PageProps {
    notifications: NotificationSetting[];
}

export default function NotificationSettings({ auth, notifications }: Props) {
    const { toast } = useToast();

    const handleToggle = (notificationType: string, currentValue: boolean) => {
        router.post(
            route('admin.notification-settings.toggle'),
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
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to update notification setting.',
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
        if (type === 'welcome' || type === 'password_reset') return 'Authentication';
        if (type === 'scan_alert') return 'QR Code Analytics';
        if (type === 'export_ready') return 'QR Code Management';
        return 'Other';
    };

    // Group notifications by category
    const groupedNotifications = notifications.reduce((acc, notification) => {
        const category = getNotificationCategory(notification.notification_type);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(notification);
        return acc;
    }, {} as Record<string, NotificationSetting[]>);

    return (
        <AuthenticatedLayout>
            <Head title="Notification Settings" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Notification Settings</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Control which email notifications are sent system-wide. Users can still opt-out individually.
                        </p>
                    </div>

                    {/* Notification Categories */}
                    {Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
                        <Card key={category}>
                            <CardHeader>
                                <CardTitle>{category}</CardTitle>
                                <CardDescription>
                                    Manage {category.toLowerCase()} email notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {categoryNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex items-center justify-between space-x-4 pb-6 border-b last:border-0 last:pb-0"
                                    >
                                        <div className="flex-1 space-y-1">
                                            <Label
                                                htmlFor={`notification-${notification.id}`}
                                                className="text-base font-medium cursor-pointer"
                                            >
                                                {getNotificationLabel(notification.notification_type)}
                                            </Label>
                                            {notification.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {notification.description}
                                                </p>
                                            )}
                                        </div>
                                        <Switch
                                            id={`notification-${notification.id}`}
                                            checked={notification.is_enabled}
                                            onCheckedChange={() =>
                                                handleToggle(notification.notification_type, notification.is_enabled)
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
                                <div className="text-2xl">ℹ️</div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">About Notification Settings</p>
                                    <p className="text-sm text-muted-foreground">
                                        These settings control whether notifications are sent system-wide. Even if enabled here,
                                        users can still opt-out of individual notifications in their account preferences.
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
