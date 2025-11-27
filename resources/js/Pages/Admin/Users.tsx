import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import type { PageProps, User } from '@/types';

interface AdminUser extends User {
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'invited' | 'suspended';
    organization?: string;
    last_seen_at?: string;
    plan?: string;
}

interface AdminUsersProps extends PageProps {
    users: AdminUser[];
}

export default function AdminUsers({ users }: AdminUsersProps) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        User Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        View and manage all users in the platform
                    </p>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Button asChild>
                            <Link href="#">Invite User (mock)</Link>
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500" htmlFor="search">
                                    Search
                                </label>
                                <Input
                                    id="search"
                                    placeholder="Search by name or email (mock)"
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Role</label>
                                <div className="flex gap-2 text-xs">
                                    <Badge variant="outline">All</Badge>
                                    <Badge variant="outline">Admin</Badge>
                                    <Badge variant="outline">Editor</Badge>
                                    <Badge variant="outline">Viewer</Badge>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Status</label>
                                <div className="flex gap-2 text-xs">
                                    <Badge variant="outline">All</Badge>
                                    <Badge variant="outline">Active</Badge>
                                    <Badge variant="outline">Invited</Badge>
                                    <Badge variant="outline">Suspended</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">All Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                    <thead>
                                        <tr className="border-b text-left text-[11px] uppercase text-muted-foreground">
                                            <th className="py-2 pr-4">Name</th>
                                            <th className="py-2 pr-4">Email</th>
                                            <th className="py-2 pr-4">Role</th>
                                            <th className="py-2 pr-4">Status</th>
                                            <th className="py-2 pr-4">Organization</th>
                                            <th className="py-2 pr-4">Plan</th>
                                            <th className="py-2 pr-4">Last Seen</th>
                                            <th className="py-2 pr-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b last:border-0">
                                                <td className="py-2 pr-4 text-sm font-medium">
                                                    {user.name}
                                                </td>
                                                <td className="py-2 pr-4 text-xs text-muted-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="py-2 pr-4">
                                                    <Badge variant="outline" className="text-[10px] uppercase">
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-2 pr-4">
                                                    <Badge
                                                        variant={
                                                            user.status === 'active'
                                                                ? 'default'
                                                                : user.status === 'invited'
                                                                ? 'outline'
                                                                : 'destructive'
                                                        }
                                                        className="text-[10px] uppercase"
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-2 pr-4 text-xs">
                                                    {user.organization || '-'}
                                                </td>
                                                <td className="py-2 pr-4 text-xs">
                                                    {user.plan || 'Free'}
                                                </td>
                                                <td className="py-2 pr-4 text-xs text-muted-foreground">
                                                    {user.last_seen_at
                                                        ? new Date(user.last_seen_at).toLocaleString()
                                                        : 'Never'}
                                                </td>
                                                <td className="py-2 pl-4 text-right text-xs">
                                                    <Button variant="outline" size="sm" className="mr-1">
                                                        View
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="mr-1">
                                                        Impersonate
                                                    </Button>
                                                    <Button variant="destructive" size="sm">
                                                        Disable
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="py-6 text-center text-xs text-muted-foreground"
                                                >
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
