import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { useToast } from '@/Components/ui/use-toast';
import { useState } from 'react';
import { Plus, Tag as TagIcon, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    qr_codes_count?: number;
}

interface Props {
    auth: any;
    tags: Tag[];
    can: {
        create: boolean;
    };
}

export default function TagsIndex({ auth, tags, can }: Props) {
    const { toast } = useToast();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const createForm = useForm({
        name: '',
        color: '#10b981',
    });

    const editForm = useForm({
        name: '',
        color: '',
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('tags.store'), {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
                toast({
                    title: "Tag created",
                    description: "New tag has been created successfully.",
                });
            },
        });
    };

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        editForm.setData({
            name: tag.name,
            color: tag.color || '#10b981',
        });
        setEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTag) return;

        editForm.put(route('tags.update', editingTag.id), {
            onSuccess: () => {
                setEditOpen(false);
                toast({
                    title: "Tag updated",
                    description: "Tag details have been updated.",
                });
            },
        });
    };

    const handleDelete = (tag: Tag) => {
        if (confirm(`Are you sure you want to delete "${tag.name}"?`)) {
            router.delete(route('tags.destroy', tag.id), {
                onSuccess: () => {
                    toast({
                        title: "Tag deleted",
                        description: "Tag has been deleted successfully.",
                    });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tags</h2>
                    {can.create && (
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Tag
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Tags" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                            <CardDescription>
                                Create tags to categorize and filter your QR codes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tags.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <TagIcon
                                                    className="w-5 h-5"
                                                    style={{ color: tag.color || 'currentColor' }}
                                                />
                                                <div>
                                                    <div className="font-medium">{tag.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {tag.qr_codes_count || 0} QR Codes
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleEdit(tag)}
                                                >
                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:text-red-600"
                                                    onClick={() => handleDelete(tag)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    No tags found. Create one to get started.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Tag</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tag Name</Label>
                            <Input
                                id="name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            {createForm.errors.name && <p className="text-sm text-red-500">{createForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={createForm.data.color}
                                    onChange={(e) => createForm.setData('color', e.target.value)}
                                />
                                <Input
                                    value={createForm.data.color}
                                    onChange={(e) => createForm.setData('color', e.target.value)}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={createForm.processing}>
                                Create Tag
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Tag Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                            />
                            {editForm.errors.name && <p className="text-sm text-red-500">{editForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-color">Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="edit-color"
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={editForm.data.color}
                                    onChange={(e) => editForm.setData('color', e.target.value)}
                                />
                                <Input
                                    value={editForm.data.color}
                                    onChange={(e) => editForm.setData('color', e.target.value)}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
