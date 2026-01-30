import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { AlertCircle, Mail } from 'lucide-react';
import { PageProps } from '@/types';

export default function NoOrganization({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    No Organization
                </h2>
            }
        >
            <Head title="No Organization" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-8 w-8 text-amber-500" />
                                <div>
                                    <CardTitle>No Organization Access</CardTitle>
                                    <CardDescription>
                                        You are not currently a member of any organization
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                You don't have access to any organizations at the moment. This could be because:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>You were removed from your organization</li>
                                <li>Your organization access was revoked</li>
                                <li>You haven't been invited to any organization yet</li>
                            </ul>
                            
                            <div className="mt-6 p-4 bg-muted rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-foreground mb-1">Need Access?</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Please contact your organization owner or administrator to request access.
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Your email: <span className="font-medium text-foreground">{auth.user.email}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
