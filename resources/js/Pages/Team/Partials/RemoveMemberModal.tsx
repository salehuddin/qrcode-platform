import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface User {
    id: number;
    name: string;
}

interface RemoveMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: User | null;
}

export default function RemoveMemberModal({
    isOpen,
    onClose,
    member,
}: RemoveMemberModalProps) {
    const { delete: destroy, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!member) return;

        destroy(route("team.members.destroy", member.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Remove Team Member</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove <span className="font-medium">{member?.name}</span> from the organization? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Remove Member
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
