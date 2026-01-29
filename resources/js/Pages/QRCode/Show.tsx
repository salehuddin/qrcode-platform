import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, QRCode, QRCustomization } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { QRCodePreview } from './Partials/QRCodePreview';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Download, Move, Tag as TagIcon, FolderOpen, Plus } from 'lucide-react';
import { Switch } from '@/Components/ui/switch';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { downloadStyledQRCode } from '@/lib/qrCodeDownload';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';

interface QRCodeShowProps extends PageProps {
    qrCode: QRCode;
    activities: any[];
    folders: any[];
    tags: any[];
}

export default function Show({ auth, qrCode, activities, folders, tags }: QRCodeShowProps) {
    console.log('Show props:', { qrCode });

    const currentQR = qrCode;

    // Ensure customization is a complete object with defaults to prevent crashes
    const customization: QRCustomization = {
        dotsColor: currentQR.customization?.dotsColor ?? currentQR.design?.foreground_color ?? '#000000',
        backgroundColor: currentQR.customization?.backgroundColor ?? currentQR.design?.background_color ?? '#ffffff',
        cornersSquareColor: currentQR.customization?.cornersSquareColor ?? currentQR.design?.foreground_color ?? '#000000',
        cornersDotsColor: currentQR.customization?.cornersDotsColor ?? currentQR.design?.foreground_color ?? '#000000',
        dotsType: currentQR.customization?.dotsType ?? (currentQR.design?.pattern === 'dots' ? 'dots' : currentQR.design?.pattern === 'rounded' ? 'rounded' : 'square'),
        cornersSquareType: currentQR.customization?.cornersSquareType ?? 'square',
        cornersDotsType: currentQR.customization?.cornersDotsType ?? 'dot',
        width: currentQR.customization?.width ?? 300,
        height: currentQR.customization?.height ?? 300,
        errorCorrectionLevel: currentQR.customization?.errorCorrectionLevel ?? currentQR.design?.error_correction ?? 'M',
        imageSize: currentQR.customization?.imageSize ?? 0.2,
        gradientEnabled: currentQR.customization?.gradientEnabled ?? false,
        gradientType: currentQR.customization?.gradientType ?? 'linear',
        gradientStartColor: currentQR.customization?.gradientStartColor ?? '#000000',
        gradientEndColor: currentQR.customization?.gradientEndColor ?? '#000000',
        gradientRotation: currentQR.customization?.gradientRotation ?? 0,
        image: currentQR.customization?.image,
    };

    // State for dialogs
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newTagName, setNewTagName] = useState('');

    // Forms
    const moveForm = useForm({
        folder_id: currentQR.folder_id as number | null
    });

    const tagsForm = useForm({
        tag_ids: currentQR.tags ? currentQR.tags.map((t: any) => t.id) : [] as number[]
    });

    const createFolderForm = useForm({
        name: '',
        parent_id: null as number | null
    });

    const createTagForm = useForm({
        name: ''
    });

    // Handlers
    const handleMoveQRCode = () => {
        router.post(route('qr-codes.bulk-move'), {
            ids: [currentQR.id],
            folder_id: moveForm.data.folder_id
        }, {
            onSuccess: () => {
                setIsMoveDialogOpen(false);
            }
        });
    };

    const handleUpdateTags = () => {
        router.post(route('qr-codes.bulk-update-tags'), {
            ids: [currentQR.id],
            tag_ids: tagsForm.data.tag_ids
        }, {
            onSuccess: () => {
                setIsTagsDialogOpen(false);
            }
        });
    };

    const handleCreateFolderInline = () => {
        if (!newFolderName.trim()) return;
        
        createFolderForm.setData('name', newFolderName);
        createFolderForm.post(route('folders.store'), {
            onSuccess: () => {
                setNewFolderName('');
            }
        });
    };

    const handleCreateTagInline = () => {
        if (!newTagName.trim()) return;
        
        createTagForm.setData('name', newTagName);
        createTagForm.post(route('tags.store'), {
            onSuccess: () => {
                setNewTagName('');
            }
        });
    };

    const toggleTag = (tagId: number) => {
        const currentTags = tagsForm.data.tag_ids;
        if (currentTags.includes(tagId)) {
            tagsForm.setData('tag_ids', currentTags.filter(id => id !== tagId));
        } else {
            tagsForm.setData('tag_ids', [...currentTags, tagId]);
        }
    };

    const handleEdit = () => {
        router.visit(`/qr-codes/${currentQR.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this QR code?')) {
            router.delete(`/qr-codes/${currentQR.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    QR Code Details
                </h2>
            }
        >
            <Head title={`QR Code: ${currentQR.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Back button & Actions */}
                        <div className="flex items-center justify-between">
                            <Link
                                href="/qr-codes"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                ← Back to QR Codes
                            </Link>
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => downloadStyledQRCode(currentQR.content, customization, currentQR.name, 'png')}>
                                            PNG Image (.png)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => downloadStyledQRCode(currentQR.content, customization, currentQR.name, 'svg')}>
                                            SVG Vector (.svg)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => downloadStyledQRCode(currentQR.content, customization, currentQR.name, 'jpeg')}>
                                            JPEG Image (.jpeg)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => downloadStyledQRCode(currentQR.content, customization, currentQR.name, 'webp')}>
                                            WebP Image (.webp)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Button asChild variant="outline">
                                    <Link href={`/qr-codes/${currentQR.id}/analytics`}>
                                        View Analytics
                                    </Link>
                                </Button>
                                
                                <Button onClick={() => setIsMoveDialogOpen(true)} variant="outline">
                                    <Move className="mr-2 h-4 w-4" />
                                    Move to Folder
                                </Button>
                                
                                <Button onClick={() => setIsTagsDialogOpen(true)} variant="outline">
                                    <TagIcon className="mr-2 h-4 w-4" />
                                    Manage Tags
                                </Button>
                                
                                <Button onClick={handleEdit} variant="outline">
                                    Edit
                                </Button>
                                <Button onClick={handleDelete} variant="destructive">
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* QR Code Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>QR Code Preview</CardTitle>
                                    <CardDescription>
                                        Scan this QR code to test functionality
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <div className="w-full max-w-xs">
                                        <QRCodePreview 
                                            data={currentQR.content} 
                                            customization={customization} 
                                            showDownloadButtons={false}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* QR Code Information */}
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{currentQR.name}</CardTitle>
                                            <CardDescription>
                                                {currentQR.type.toUpperCase()} QR Code
                                            </CardDescription>
                                        </div>
                                        <Badge variant={currentQR.is_active ? "default" : "secondary"}>
                                            {currentQR.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Destination</label>
                                        <p className="text-sm break-all">{currentQR.destination_url || currentQR.content}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Scans</label>
                                            <p className="text-2xl font-bold text-blue-600">{currentQR.scan_count}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Unique Scans</label>
                                            <p className="text-2xl font-bold text-green-600">{currentQR.unique_scans}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Last Scanned</label>
                                        <p className="text-sm">
                                            {currentQR.last_scanned_at ? 
                                                new Date(currentQR.last_scanned_at).toLocaleString() : 
                                                'Never'
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        {currentQR.mode === 'dynamic' ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Switch
                                                    checked={currentQR.is_active}
                                                    onCheckedChange={() => {
                                                        router.patch(route('qr-codes.toggle-status', currentQR.id));
                                                    }}
                                                />
                                                <span className="text-sm">
                                                    {currentQR.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-sm">
                                                <Badge variant={currentQR.is_active ? "default" : "secondary"}>
                                                    {currentQR.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created</label>
                                        <p className="text-sm">
                                            {new Date(currentQR.created_at).toLocaleString()}
                                            {currentQR.user && <span className="text-muted-foreground"> by {currentQR.user.name}</span>}
                                        </p>
                                    </div>

                                    {/* Folder and Tags */}
                                    <div className="pt-4 border-t">
                                        <label className="text-sm font-medium text-gray-500 block mb-2">Organization</label>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {/* Folder */}
                                            {currentQR.folder ? (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FolderOpen className="w-4 h-4 text-blue-500" />
                                                    <span className="text-muted-foreground">{currentQR.folder.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FolderOpen className="w-4 h-4 text-gray-400" />
                                                    <span className="text-muted-foreground">No Folder</span>
                                                </div>
                                            )}
                                            
                                            {/* Tags */}
                                            {currentQR.tags && currentQR.tags.length > 0 ? (
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {currentQR.tags.map((tag: any) => (
                                                        <Badge 
                                                            key={tag.id}
                                                            variant="outline" 
                                                            className="rounded-full h-6"
                                                            style={{ 
                                                                backgroundColor: tag.color + '20',
                                                                color: tag.color,
                                                                borderColor: tag.color + '40'
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No tags</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Design Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Design Settings</CardTitle>
                                <CardDescription>Current design configuration</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Foreground Color</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div 
                                                className="w-4 h-4 rounded border"
                                                style={{ backgroundColor: currentQR.design?.foreground_color ?? '#000000' }}
                                            ></div>
                                            <span className="text-sm">{currentQR.design?.foreground_color ?? '#000000'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Background Color</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div 
                                                className="w-4 h-4 rounded border"
                                                style={{ backgroundColor: currentQR.design?.background_color ?? '#ffffff' }}
                                            ></div>
                                            <span className="text-sm">{currentQR.design?.background_color ?? '#ffffff'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Pattern</label>
                                        <p className="text-sm mt-1 capitalize">{currentQR.design?.pattern ?? 'square'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Error Correction</label>
                                        <p className="text-sm mt-1">{currentQR.design?.error_correction ?? 'M'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Audit Trail */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Log</CardTitle>
                                <CardDescription>History of changes and actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activities && activities.length > 0 ? (
                                        activities.map((log: any) => (
                                            <div key={log.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                                                <div className="mt-1 bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">
                                                        {log.event.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {log.description}
                                                        <span className="text-muted-foreground font-normal"> by {log.causer?.name || 'System'}</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Move to Folder Dialog */}
            <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move to Folder</DialogTitle>
                        <DialogDescription>
                            Select an existing folder or create a new one.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Create New Folder Input */}
                        <div className="space-y-2">
                            <Label>Create New Folder</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter new folder name..."
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newFolderName.trim()) {
                                            e.preventDefault();
                                            handleCreateFolderInline();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleCreateFolderInline}
                                    disabled={!newFolderName.trim() || createFolderForm.processing}
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Create
                                </Button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or select existing</span>
                            </div>
                        </div>

                        {/* Existing Folders List */}
                        <div className="space-y-2">
                            <Label>Select Folder</Label>
                            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 space-y-1">
                                <div 
                                    className={`flex items-center px-2 py-2 rounded-md cursor-pointer ${
                                        moveForm.data.folder_id === null ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                    }`}
                                    onClick={() => moveForm.setData('folder_id', null)}
                                >
                                    <FolderOpen className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">No Folder (Root)</span>
                                </div>
                                {folders.filter((f: any) => !f.parent_id).map((folder: any) => (
                                    <div
                                        key={folder.id}
                                        className={`flex items-center px-2 py-2 rounded-md cursor-pointer ${
                                            moveForm.data.folder_id === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                        }`}
                                        onClick={() => moveForm.setData('folder_id', folder.id)}
                                    >
                                        <FolderOpen className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{folder.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {moveForm.data.folder_id && (
                            <div className="text-sm text-muted-foreground">
                                Selected: <span className="font-medium">{folders.find((f: any) => f.id === moveForm.data.folder_id)?.name}</span>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleMoveQRCode} disabled={moveForm.processing}>Move</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Tags Dialog */}
            <Dialog open={isTagsDialogOpen} onOpenChange={setIsTagsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Manage Tags</DialogTitle>
                        <DialogDescription>
                            Type to create a new tag or select from existing tags.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Create New Tag Input */}
                        <div className="space-y-2">
                            <Label>Add Tag</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type tag name and press Enter..."
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newTagName.trim()) {
                                            e.preventDefault();
                                            handleCreateTagInline();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleCreateTagInline}
                                    disabled={!newTagName.trim() || createTagForm.processing}
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Create
                                </Button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Available tags</span>
                            </div>
                        </div>

                        {/* Existing Tags */}
                        <div className="space-y-2">
                            <Label>Select Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag: any) => (
                                    <Badge
                                        key={tag.id}
                                        variant={tagsForm.data.tag_ids.includes(tag.id) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => toggleTag(tag.id)}
                                        style={tagsForm.data.tag_ids.includes(tag.id) && tag.color ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                                {tags.length === 0 && (
                                    <span className="text-sm text-muted-foreground">No tags available. Create one above.</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTagsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateTags} disabled={tagsForm.processing}>Update Tags</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}