import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    teams: Array<{ id: number; name: string }>;
}

export default function InviteMemberModal({
    isOpen,
    onClose,
    teams,
}: InviteMemberModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        role: "viewer",
        team_id: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Use invitations endpoint which handles both new and existing users via logic?
        // Actually, previous analysis: TeamMemberController handles existing. InvitationController handles new.
        // But we want to 'Invite' new people.
        
        post(route("invitations.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                        Invite a new member to your organization. They will receive an email invitation.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="colleague@example.com"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData("role", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-destructive">{errors.role}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="team">Team (Optional)</Label>
                        <Select
                            value={data.team_id}
                            onValueChange={(value) => setData("team_id", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Assign to a team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-team">No Team</SelectItem>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Send Invitation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
