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
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateTeamModal({
    isOpen,
    onClose,
}: CreateTeamModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("teams.store"), {
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
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                        Create a new sub-team to organize your members and projects.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Marketing"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Optional description for this team"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
