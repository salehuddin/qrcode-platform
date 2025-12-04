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
import { FormEventHandler, useEffect } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    pivot: {
        role: string;
    };
}

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: User | null;
}

export default function EditMemberModal({
    isOpen,
    onClose,
    member,
}: EditMemberModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        role: "viewer",
    });

    useEffect(() => {
        if (member) {
            setData("role", member.pivot.role);
        }
    }, [member]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!member) return;

        put(route("team.members.update", member.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                    <DialogDescription>
                        Update role and permissions for {member?.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={member?.email || ''}
                            disabled
                            className="bg-muted"
                        />
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
