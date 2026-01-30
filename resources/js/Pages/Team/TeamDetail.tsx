import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { ArrowLeft, Plus, Trash2, QrCode } from "lucide-react";
import { useState } from "react";

interface Member {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
    qr_codes_count: number;
}

interface AvailableMember {
    id: number;
    name: string;
    email: string;
}

interface QRCode {
    id: number;
    name: string;
    destination_url: string;
    scan_count: number;
    user: {
        name: string;
    };
}

interface Team {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

interface TeamDetailProps extends PageProps {
    team: Team;
    members: Member[];
    availableMembers: AvailableMember[];
    qrCodes: QRCode[];
}

export default function TeamDetail({
    auth,
    team,
    members,
    availableMembers,
    qrCodes,
}: TeamDetailProps) {
    const [selectedMember, setSelectedMember] = useState<string>("");

    const handleAddMember = () => {
        if (!selectedMember) return;

        router.post(
            route("teams.members.add", team.id),
            { user_id: selectedMember },
            {
                onSuccess: () => setSelectedMember(""),
            }
        );
    };

    const handleRemoveMember = (userId: number) => {
        if (confirm("Are you sure you want to remove this member from the team?")) {
            router.delete(route("teams.members.remove", [team.id, userId]));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(route("team.index"))}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        {team.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Team: ${team.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Team Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{team.name}</CardTitle>
                            <CardDescription>
                                {team.description || "No description"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Created {new Date(team.created_at).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Team Members ({members.length})</CardTitle>
                                    <CardDescription>
                                        Manage who belongs to this team
                                    </CardDescription>
                                </div>
                                {availableMembers.length > 0 && (
                                    <div className="flex gap-2">
                                        <Select
                                            value={selectedMember}
                                            onValueChange={setSelectedMember}
                                        >
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Select member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableMembers.map((member) => (
                                                    <SelectItem
                                                        key={member.id}
                                                        value={member.id.toString()}
                                                    >
                                                        {member.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={handleAddMember}
                                            disabled={!selectedMember}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Member
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {members.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No members in this team yet
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>QR Codes</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={member.profile_photo_url} />
                                                        <AvatarFallback>
                                                            {member.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-foreground">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {member.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{member.qr_codes_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Team QR Codes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>QR Codes ({qrCodes.length})</CardTitle>
                            <CardDescription>
                                QR codes tagged with this team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {qrCodes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No QR codes tagged with this team yet
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Scans</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {qrCodes.map((qr) => (
                                            <TableRow key={qr.id}>
                                                <TableCell>
                                                    <div className="font-medium">{qr.name}</div>
                                                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                        {qr.destination_url}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{qr.user.name}</TableCell>
                                                <TableCell>{qr.scan_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.visit(route("qr-codes.show", qr.id))
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
