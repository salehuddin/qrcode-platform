import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Plus, Users, Shield, Mail } from "lucide-react";
import { useState } from "react";
import InviteMemberModal from "./Partials/InviteMemberModal";
import CreateTeamModal from "./Partials/CreateTeamModal";
import EditMemberModal from "./Partials/EditMemberModal";
import RemoveMemberModal from "./Partials/RemoveMemberModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
    pivot: {
        role: string;
        joined_at: string;
    };
}

interface Team {
    id: number;
    name: string;
    description?: string;
    users_count?: number;
    created_at: string;
}

interface TeamDashboardProps extends PageProps {
    organization: {
        id: number;
        name: string;
    };
    members: User[];
    teams: Team[];
}

export default function TeamIndex({ auth, organization, members, teams }: TeamDashboardProps) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<User | null>(null);
    const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'owner': return 'default';
            case 'admin': return 'destructive';
            case 'editor': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Team Management
                </h2>
            }
        >
            <Head title="Team Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-end mb-6">
                        <div className="flex gap-2">
                            <Button onClick={() => setIsCreateTeamModalOpen(true)} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                New Team
                            </Button>
                            <Button onClick={() => setIsInviteModalOpen(true)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Invite Member
                            </Button>
                        </div>
                    </div>
                    <Tabs defaultValue="members" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="members">Members</TabsTrigger>
                            <TabsTrigger value="teams">Teams</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="members" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization Members</CardTitle>
                                    <CardDescription>
                                        Manage users who have access to this organization.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Joined</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {members.map((member) => (
                                                <TableRow key={member.id}>
                                                    <TableCell className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={member.profile_photo_url} />
                                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{member.name}</div>
                                                            <div className="text-sm text-muted-foreground">{member.email}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getRoleBadgeVariant(member.pivot.role) as any}>
                                                            {member.pivot.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(member.pivot.joined_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => setMemberToEdit(member)}
                                                                disabled={member.pivot.role === 'owner'}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => setMemberToRemove(member)}
                                                                disabled={member.pivot.role === 'owner' || member.id === auth.user.id}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="teams" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {teams.map((team) => (
                                    <Card key={team.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {team.name}
                                            </CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{team.users_count || 0}</div>
                                            <p className="text-xs text-muted-foreground">
                                                Members
                                            </p>
                                            <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                                                {team.description || "No description"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization Settings</CardTitle>
                                    <CardDescription>
                                        Manage your organization profile and preferences.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Settings content coming soon...</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <InviteMemberModal 
                isOpen={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)}
                teams={teams}
            />

            <CreateTeamModal 
                isOpen={isCreateTeamModalOpen} 
                onClose={() => setIsCreateTeamModalOpen(false)}
            />

            <EditMemberModal
                isOpen={!!memberToEdit}
                onClose={() => setMemberToEdit(null)}
                member={memberToEdit}
            />

            <RemoveMemberModal
                isOpen={!!memberToRemove}
                onClose={() => setMemberToRemove(null)}
                member={memberToRemove}
            />
        </AuthenticatedLayout>
    );
}
