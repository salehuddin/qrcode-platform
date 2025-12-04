import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { useToast } from '@/Components/ui/use-toast';
import { useState } from 'react';
import { Badge } from '@/Components/ui/badge';

interface Member {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'editor' | 'viewer';
    joined_at: string;
}

interface Props {
    auth: any;
    organization: {
        id: number;
        name: string;
    };
    members: Member[];
    can: {
        manage_members: boolean;
    };
}

export default function MembersSettings({ auth, organization, members, can }: Props) {
    const { toast } = useToast();
    const [inviteOpen, setInviteOpen] = useState(false);

    const inviteForm = useForm({
        email: '',
        role: 'viewer',
    });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        inviteForm.post(route('invitations.store'), {
            onSuccess: () => {
                setInviteOpen(false);
                inviteForm.reset();
                toast({
                    title: "Invitation sent",
                    description: `Invitation sent to ${inviteForm.data.email}`,
                });
            },
        });
    };

    const updateRole = (memberId: number, newRole: string) => {
        router.put(route('settings.organization.members.role', memberId), {
            role: newRole
        }, {
            onSuccess: () => {
                toast({
                    title: "Role updated",
                    description: "Member role has been updated.",
                });
            },
        });
    };

    const removeMember = (memberId: number) => {
        if (confirm('Are you sure you want to remove this member?')) {
            router.delete(route('settings.organization.members.remove', memberId), {
                onSuccess: () => {
                    toast({
                        title: "Member removed",
                        description: "Member has been removed from the organization.",
                    });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Team Members</h2>}
        >
            <Head title="Team Members" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Members</CardTitle>
                                <CardDescription>
                                    Manage who has access to {organization.name}.
                                </CardDescription>
                            </div>
                            {can.manage_members && (
                                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Invite Member</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Invite Team Member</DialogTitle>
                                            <DialogDescription>
                                                Send an email invitation to join your organization.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleInvite} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={inviteForm.data.email}
                                                    onChange={(e) => inviteForm.setData('email', e.target.value)}
                                                    required
                                                />
                                                {inviteForm.errors.email && <p className="text-sm text-red-500">{inviteForm.errors.email}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="role">Role</Label>
                                                <Select
                                                    value={inviteForm.data.role}
                                                    onValueChange={(value) => inviteForm.setData('role', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="editor">Editor</SelectItem>
                                                        <SelectItem value="viewer">Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={inviteForm.processing}>
                                                    Send Invitation
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {member.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                {can.manage_members && member.id !== auth.user.id && (
                                                    <div className="flex justify-end gap-2">
                                                        <Select
                                                            value={member.role}
                                                            onValueChange={(value) => updateRole(member.id, value)}
                                                        >
                                                            <SelectTrigger className="w-[100px] h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="editor">Editor</SelectItem>
                                                                <SelectItem value="viewer">Viewer</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeMember(member.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
