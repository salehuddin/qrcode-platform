import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { useToast } from '@/Components/ui/use-toast';
import { useState } from 'react';
import FolderTree from '@/Components/FolderTree';
import { Plus } from 'lucide-react';

import { Folder } from '@/types';

// Remove local Folder interface


interface Props {
    auth: any;
    folders: Folder[];
    can: {
        create: boolean;
    };
}

export default function FoldersIndex({ auth, folders, can }: Props) {
    const { toast } = useToast();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

    const createForm = useForm({
        name: '',
        parent_id: null as number | null,
        color: '#3b82f6',
    });

    const editForm = useForm({
        name: '',
        color: '',
    });

    const handleCreate = (parentId: number | null = null) => {
        setSelectedParentId(parentId);
        createForm.setData('parent_id', parentId);
        setCreateOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('folders.store'), {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
                toast({
                    title: "Folder created",
                    description: "New folder has been created successfully.",
                });
            },
        });
    };

    const handleEdit = (folder: Folder) => {
        setEditingFolder(folder);
        editForm.setData({
            name: folder.name,
            color: folder.color || '#3b82f6',
        });
        setEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFolder) return;

        editForm.put(route('folders.update', editingFolder.id), {
            onSuccess: () => {
                setEditOpen(false);
                toast({
                    title: "Folder updated",
                    description: "Folder details have been updated.",
                });
            },
        });
    };

    const handleDelete = (folder: Folder) => {
        if (confirm(`Are you sure you want to delete "${folder.name}"? This will also delete all subfolders.`)) {
            router.delete(route('folders.destroy', folder.id), {
                onSuccess: () => {
                    toast({
                        title: "Folder deleted",
                        description: "Folder has been deleted successfully.",
                    });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Folders</h2>
                    {can.create && (
                        <Button onClick={() => handleCreate(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Root Folder
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Folders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Folder Structure</CardTitle>
                            <CardDescription>
                                Organize your QR codes with a hierarchical folder structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {folders.length > 0 ? (
                                <FolderTree
                                    folders={folders}
                                    onCreateSubfolder={handleCreate}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    No folders found. Create one to get started.
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
                        <DialogTitle>Create New Folder</DialogTitle>
                        <DialogDescription>
                            {selectedParentId ? "Create a subfolder inside the selected folder." : "Create a new top-level folder."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Folder Name</Label>
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
                                Create Folder
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Folder</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Folder Name</Label>
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
