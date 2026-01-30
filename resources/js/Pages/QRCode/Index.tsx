import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { PageProps, QRCode, Folder, Tag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { useState, useMemo } from 'react';
import Checkbox from '@/Components/Checkbox';
import FolderTree from '@/Components/FolderTree';
import { Folder as FolderIcon, Plus, FolderOpen, MoreVertical, Tag as TagIcon, Move, Trash2, RotateCcw } from 'lucide-react';
import { QRCodePreview } from './Partials/QRCodePreview';
import QRCodeStyling from 'qr-code-styling';
import { downloadStyledQRCode } from '@/lib/qrCodeDownload';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Switch } from '@/Components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";

// Mock data for development
const mockQRCodes: QRCode[] = [
    {
        id: '1',
        name: 'Restaurant Menu',
        type: 'url',
        mode: 'dynamic',
        content: 'https://restaurant.com/menu',
        destination_url: 'https://restaurant.com/menu',
        is_active: true,
        scan_count: 156,
        unique_scans: 134,
        last_scanned_at: '2024-01-20 14:30:00',
        created_at: '2024-01-15 10:00:00',
        updated_at: '2024-01-20 14:30:00',
        design: {
            foreground_color: '#000000',
            background_color: '#ffffff',
            pattern: 'square',
            error_correction: 'M'
        },
        user_id: 1,
        folder_id: 1,
        tags: [{ id: 1, name: 'Food', color: '#ef4444', organization_id: 1 }]
    }
];

const mockFolders: Folder[] = [
    { id: 1, name: 'Business', organization_id: 1, parent_id: null },
    { id: 2, name: 'Personal', organization_id: 1, parent_id: null },
    { id: 3, name: 'Subfolder A', organization_id: 1, parent_id: 1 },
];

const mockTags: Tag[] = [
    { id: 1, name: 'Food', color: '#ef4444', organization_id: 1 },
    { id: 2, name: 'Marketing', color: '#22c55e', organization_id: 1 },
    { id: 3, name: 'Personal', color: '#3b82f6', organization_id: 1 },
    { id: 4, name: 'Office', color: '#f97316', organization_id: 1 },
];

interface Team {
    id: number;
    name: string;
}

interface QRCodeIndexProps extends PageProps {
    qrCodes?: QRCode[];
    folders?: Folder[];
    tags?: Tag[];
    teams?: Team[];
    view?: 'active' | 'all' | 'trash';
}

export default function QRCodeIndex({ qrCodes = mockQRCodes, folders = mockFolders, tags = mockTags, teams = [], view = 'active' }: QRCodeIndexProps) {
    const { props } = usePage();
    const router = useForm(); // Use useForm for Inertia actions

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [modeFilter, setModeFilter] = useState<'all' | 'static' | 'dynamic'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'scans' | 'recent'>('recent');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Folder State
    const [selectedFolderId, setSelectedFolderId] = useState<number | string | null>(null);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
    const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
    const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [parentFolderId, setParentFolderId] = useState<number | null>(null);

    // Move & Tag State
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
    const [targetQrIds, setTargetQrIds] = useState<string[]>([]);
    const [targetFolderId, setTargetFolderId] = useState<number | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    // Tag Filter & Creation State
    const [selectedTagFilterId, setSelectedTagFilterId] = useState<number | string | null>(null);
    const [selectedTeamFilterId, setSelectedTeamFilterId] = useState<number | string | null>(null);
    const [newTagName, setNewTagName] = useState('');
    const [isDeleteTagOpen, setIsDeleteTagOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            url: '🔗',
            vcard: '👤',
            wifi: '📶',
            sms: '💬',
            email: '📧',
            phone: '📞',
            location: '📍',
            event: '📅'
        };
        return icons[type] || '📱';
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };
    // Forms
    const createFolderForm = useForm({
        name: '',
        parent_id: null as number | null
    });

    const editFolderForm = useForm({
        name: ''
    });

    const createTagForm = useForm({
        name: '',
        color: '#3b82f6' // Default blue
    });

    const moveForm = useForm({
        ids: [] as string[],
        folder_id: null as number | null
    });

    const tagsForm = useForm({
        ids: [] as string[],
        tag_ids: [] as number[]
    });

    const filteredAndSortedQRCodes = useMemo(() => {
        let filtered = qrCodes.filter(qr => {
            // Folder filter
            if (selectedFolderId !== null) {
                if (selectedFolderId === 'no-folder') {
                    // Show QR codes without a folder (handle both null and undefined)
                    if (qr.folder_id != null) return false;
                } else {
                    // Show QR codes in specific folder
                    if (qr.folder_id !== selectedFolderId) return false;
                }
            }

            // Tag filter
            if (selectedTagFilterId !== null) {
                if (selectedTagFilterId === 'no-tag') {
                    // Show QR codes without any tags
                    if (qr.tags && qr.tags.length > 0) return false;
                } else {
                    // Show QR codes with specific tag
                    if (!qr.tags || !qr.tags.some(t => t.id === selectedTagFilterId)) return false;
                }
            }

            // Search filter
            const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Status filter
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' ? qr.is_active : !qr.is_active);
            
            // Mode filter
            const matchesMode = modeFilter === 'all' || qr.mode === modeFilter;
            
            return matchesSearch && matchesStatus && matchesMode;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'scans') {
                return b.scan_count - a.scan_count;
            } else {
                // 'recent'
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return filtered;
    }, [qrCodes, searchTerm, statusFilter, modeFilter, sortBy, selectedFolderId, selectedTagFilterId]);

    // Helper function to count QR codes in a folder
    const getQRCountForFolder = (folderId: number) => {
        return qrCodes.filter(qr => qr.folder_id === folderId).length;
    };

    // Helper function to count QR codes with a tag
    const getQRCountForTag = (tagId: number) => {
        return qrCodes.filter(qr => qr.tags && qr.tags.some(t => t.id === tagId)).length;
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredAndSortedQRCodes.map(qr => qr.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    // Standalone folder creation (from sidebar)
    const handleCreateFolder = () => {
        createFolderForm.post(route('folders.store'), {
            onSuccess: () => {
                setIsCreateFolderOpen(false);
                createFolderForm.reset();
            }
        });
    };

    // Inline folder creation (from Move dialog) - auto-selects the new folder
    const handleCreateFolderInline = () => {
        if (!newFolderName.trim()) return;
        
        createFolderForm.setData('name', newFolderName);
        createFolderForm.post(route('folders.store'), {
            onSuccess: (response: any) => {
                // Auto-select the newly created folder
                const newFolder = response.props.folders?.[response.props.folders.length - 1];
                if (newFolder) {
                    moveForm.setData('folder_id', newFolder.id);
                }
                setNewFolderName('');
                createFolderForm.reset();
            }
        });
    };

    // Inline tag creation (from Manage Tags dialog) - auto-selects the new tag
    // Inline tag creation (from Manage Tags dialog) - auto-selects the new tag
    const handleCreateTagInline = () => {
        if (!newTagName.trim() || createTagForm.processing) return;
        
        const tagNameToCreate = newTagName;
        
        // Use transform to set the data immediately before posting
        // This avoids async state issues with setData
        createTagForm.transform((data) => ({
            ...data,
            name: tagNameToCreate,
            color: '#3b82f6'
        }));
        
        createTagForm.post(route('tags.store'), {
            preserveScroll: true,
            onSuccess: (page: any) => {
                // Get all tags from the page props
                const allTags = page.props.tags || [];
                
                // Find the newly created tag by name
                const newTag = allTags.find((tag: any) => tag.name === tagNameToCreate);
                
                if (newTag) {
                    // Auto-select the newly created tag
                    const currentTags = tagsForm.data.tag_ids;
                    if (!currentTags.includes(newTag.id)) {
                        tagsForm.setData('tag_ids', [...currentTags, newTag.id]);
                    }
                }
                
                // Clear the input
                setNewTagName('');
                createTagForm.reset();
            },
            onError: (errors: any) => {
                console.error('Tag creation failed:', errors);
            }
        });
    };

    // Standalone tag creation (from sidebar)
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
    const handleCreateTag = () => {
        createTagForm.post(route('tags.store'), {
            onSuccess: () => {
                setIsCreateTagOpen(false);
                createTagForm.reset();
            }
        });
    };

    const handleDeleteFolder = (folder: Folder) => {
        setFolderToDelete(folder);
        setIsDeleteFolderOpen(true);
    };

    const confirmDeleteFolder = () => {
        if (folderToDelete) {
            router.delete(route('folders.destroy', folderToDelete.id));
            setIsDeleteFolderOpen(false);
            setFolderToDelete(null);
        }
    };

    const handleEditFolder = (folder: Folder) => {
        setFolderToEdit(folder);
        editFolderForm.setData('name', folder.name);
        setIsEditFolderOpen(true);
    };

    const submitEditFolder = () => {
        if (folderToEdit) {
            editFolderForm.put(route('folders.update', folderToEdit.id), {
                onSuccess: () => {
                    setIsEditFolderOpen(false);
                    setFolderToEdit(null);
                    editFolderForm.reset();
                }
            });
        }
    };

    const handleDeleteTag = (tag: Tag) => {
        setTagToDelete(tag);
        setIsDeleteTagOpen(true);
    };

    const confirmDeleteTag = () => {
        if (tagToDelete) {
            router.delete(route('tags.destroy', tagToDelete.id));
            setIsDeleteTagOpen(false);
            setTagToDelete(null);
        }
    };

    const openMoveDialog = (ids: string[]) => {
        moveForm.setData({
            ids: ids,
            folder_id: null
        });
        setIsMoveDialogOpen(true);
    };

    const handleMoveQRCodes = () => {
        moveForm.post(route('qr-codes.bulk-move'), {
            onSuccess: () => {
                setIsMoveDialogOpen(false);
                moveForm.reset();
                setSelectedIds(new Set()); // Clear selection
            }
        });
    };

    const openTagsDialog = (ids: string[]) => {
        let initialTags: number[] = [];
        // If single selection, pre-fill tags
        if (ids.length === 1) {
            const qr = qrCodes.find(q => q.id === ids[0]);
            if (qr && qr.tags) {
                initialTags = qr.tags.map(t => t.id);
            }
        }
        
        tagsForm.setData({
            ids: ids,
            tag_ids: initialTags
        });
        setIsTagsDialogOpen(true);
    };

    const handleUpdateTags = () => {
        tagsForm.post(route('qr-codes.bulk-tags'), {
            onSuccess: () => {
                setIsTagsDialogOpen(false);
                tagsForm.reset();
                setSelectedIds(new Set()); // Clear selection
            }
        });
    };

    const toggleTagSelection = (tagId: number) => {
        const currentTags = tagsForm.data.tag_ids;
        const newTags = currentTags.includes(tagId)
            ? currentTags.filter(id => id !== tagId)
            : [...currentTags, tagId];
            
        tagsForm.setData('tag_ids', newTags);
    };

    // Download QR Code handler (Legacy client-side, now using backend)
    // const handleDownloadQRCode = ...

    const isAllSelected = filteredAndSortedQRCodes.length > 0 && 
        filteredAndSortedQRCodes.every(qr => selectedIds.has(qr.id));
    const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    QR Codes
                </h2>
            }
        >
            <Head title="QR Codes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Sidebar: Folders & Tags */}
                        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
                            {/* Folders Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Folders</CardTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                createFolderForm.setData('parent_id', null);
                                                setIsCreateFolderOpen(true);
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-2">
                                    <div 
                                        className={`flex items-center px-2 py-2 rounded-md cursor-pointer mb-1 ${selectedFolderId === null && selectedTagFilterId === null ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'}`}
                                        onClick={() => {
                                            setSelectedFolderId(null);
                                            setSelectedTagFilterId(null);
                                        }}
                                    >
                                        <span className="text-sm font-medium pl-2">All QR Codes</span>
                                    </div>

                                    {/* No Folder Option */}
                                    <div
                                        className={`flex items-center px-2 py-2 rounded-md cursor-pointer mb-1 ${
                                            selectedFolderId === 'no-folder' ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                        }`}
                                        onClick={() => {
                                            setSelectedFolderId(selectedFolderId === 'no-folder' ? null : 'no-folder');
                                            setSelectedTagFilterId(null);
                                        }}
                                    >
                                        <span className="text-sm flex-1 italic pl-2">No Folder</span>
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                            {qrCodes.filter(qr => qr.folder_id == null).length}
                                        </Badge>
                                    </div>
                                    
                                    {/* Flat Folder List */}
                                    <div className="space-y-1">
                                        {folders.filter(f => !f.parent_id).map((folder) => (
                                            <div
                                                key={folder.id}
                                                className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer group ${
                                                    selectedFolderId === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                                }`}
                                            >
                                                <div 
                                                    className="flex items-center flex-1 min-w-0"
                                                    onClick={() => {
                                                        setSelectedFolderId(folder.id);
                                                        setSelectedTagFilterId(null);
                                                    }}
                                                >
                                                    <FolderIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="text-sm truncate flex-1">{folder.name}</span>
                                                    <Badge variant="secondary" className="ml-2 text-xs">
                                                        {getQRCountForFolder(folder.id)}
                                                    </Badge>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteFolder(folder)}
                                                            className="text-red-600"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tags Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Tags</CardTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0"
                                            onClick={() => setIsCreateTagOpen(true)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-2">
                                    <div className="space-y-1">
                                        {/* No Tag Option */}
                                        <div
                                            className={`flex items-center px-2 py-2 rounded-md cursor-pointer mb-1 ${
                                                selectedTagFilterId === 'no-tag' ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                            }`}
                                            onClick={() => {
                                                setSelectedTagFilterId(selectedTagFilterId === 'no-tag' ? null : 'no-tag');
                                                setSelectedFolderId(null);
                                            }}
                                        >
                                            <span className="text-sm flex-1 italic pl-2">No Tag</span>
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                {qrCodes.filter(qr => !qr.tags || qr.tags.length === 0).length}
                                            </Badge>
                                        </div>

                                        {tags.map((tag) => (
                                            <div
                                                key={tag.id}
                                                className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer group ${
                                                    selectedTagFilterId === tag.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                                }`}
                                            >
                                                <div 
                                                    className="flex items-center flex-1 min-w-0"
                                                    onClick={() => {
                                                        setSelectedTagFilterId(selectedTagFilterId === tag.id ? null : tag.id);
                                                        setSelectedFolderId(null);
                                                    }}
                                                >
                                                    <TagIcon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: tag.color }} />
                                                    <span className="text-sm truncate flex-1">{tag.name}</span>
                                                    <Badge variant="secondary" className="ml-2 text-xs">
                                                        {getQRCountForTag(tag.id)}
                                                    </Badge>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteTag(tag)}
                                                            className="text-red-600"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Content: QR Grid */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">
                                    {selectedFolderId !== null 
                                        ? folders.find(f => f.id === selectedFolderId)?.name 
                                        : selectedTagFilterId !== null
                                            ? `Tag: ${tags.find(t => t.id === selectedTagFilterId)?.name}`
                                            : 'All QR Codes'}
                                </h3>
                                <Button asChild>
                                    <Link href="/qr-codes/create">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create QR Code
                                    </Link>
                                </Button>
                            </div>

                            {/* Filters */}
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid gap-4 md:grid-cols-4">
                                        {/* Search */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Search</label>
                                            <Input
                                                placeholder="Search by name..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        {/* Status Filter */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                                            <select
                                                value={view}
                                                onChange={(e) => router.get(route('qr-codes.index', { view: e.target.value }))}
                                                className="w-full h-8 text-xs border border-input bg-background text-foreground rounded-md px-2 py-1"
                                            >
                                                <option value="active">Active</option>
                                                <option value="all">All</option>
                                                <option value="trash">Trash</option>
                                            </select>
                                        </div>

                                        {/* Mode Filter */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Mode</label>
                                            <select
                                                value={modeFilter}
                                                onChange={(e) => setModeFilter(e.target.value as any)}
                                                className="w-full h-8 text-xs border border-input bg-background text-foreground rounded-md px-2 py-1"
                                            >
                                                <option value="all">All Modes</option>
                                                <option value="static">Static</option>
                                                <option value="dynamic">Dynamic</option>
                                            </select>
                                        </div>

                                        {/* Sort */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Sort By</label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                className="w-full h-8 text-xs border border-input bg-background text-foreground rounded-md px-2 py-1"
                                            >
                                                <option value="recent">Recently Created</option>
                                                <option value="name">Name (A-Z)</option>
                                                <option value="scans">Most Scans</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bulk Actions */}
                            {selectedIds.size > 0 && (
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-900">
                                            {selectedIds.size} selected
                                        </p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                                                Clear
                                            </Button>
                                            <Button variant="default" size="sm" onClick={() => openMoveDialog(Array.from(selectedIds))}>
                                                <Move className="w-4 h-4 mr-2" />
                                                Move to Folder
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => openTagsDialog(Array.from(selectedIds))}>
                                                <TagIcon className="w-4 h-4 mr-2" />
                                                Manage Tags
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* QR Codes List */}
                            <div className="space-y-3">
                                {filteredAndSortedQRCodes.map((qr) => (
                                    <Card key={qr.id} className="qr-card hover:shadow-md transition-shadow">
                                        <CardContent className="p-6 gap-4">
                                            <div className="flex items-start gap-4">
                                                {/* Checkbox */}
                                                <div className="flex-shrink-0">
                                                    <Checkbox
                                                        checked={selectedIds.has(qr.id)}
                                                        onChange={(e) => handleSelectOne(qr.id, e.target.checked)}
                                                    />
                                                </div>

                                                {/* QR Code Preview */}
                                                <div className="flex-shrink-0">
                                                    <div className="qr-preview w-36 h-36 rounded-lg border-2 overflow-hidden bg-white">
                                                        <QRCodePreview 
                                                            data={qr.content} 
                                                            showDownloadButtons={false}
                                                            customization={{
                                                                dotsColor: qr.customization?.dotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                backgroundColor: qr.customization?.backgroundColor ?? qr.design?.background_color ?? '#ffffff',
                                                                cornersSquareColor: qr.customization?.cornersSquareColor ?? qr.design?.foreground_color ?? '#000000',
                                                                cornersDotsColor: qr.customization?.cornersDotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                dotsType: qr.customization?.dotsType ?? (qr.design?.pattern === 'dots' ? 'dots' : qr.design?.pattern === 'rounded' ? 'rounded' : 'square'),
                                                                cornersSquareType: qr.customization?.cornersSquareType ?? 'square',
                                                                cornersDotsType: qr.customization?.cornersDotsType ?? 'dot',
                                                                width: 144,
                                                                height: 144,
                                                                errorCorrectionLevel: qr.customization?.errorCorrectionLevel ?? qr.design?.error_correction ?? 'M',
                                                                imageSize: qr.customization?.imageSize ?? 0.2,
                                                                gradientEnabled: qr.customization?.gradientEnabled ?? false,
                                                                gradientType: qr.customization?.gradientType ?? 'linear',
                                                                gradientStartColor: qr.customization?.gradientStartColor ?? '#000000',
                                                                gradientEndColor: qr.customization?.gradientEndColor ?? '#000000',
                                                                gradientRotation: qr.customization?.gradientRotation ?? 0,
                                                                image: qr.customization?.image,
                                                            }}
                                                        />
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="w-36 mt-2 text-xs h-7"
                                                            >
                                                                Download ▼
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => downloadStyledQRCode(
                                                                qr.content,
                                                                {
                                                                    dotsColor: qr.customization?.dotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    backgroundColor: qr.customization?.backgroundColor ?? qr.design?.background_color ?? '#ffffff',
                                                                    cornersSquareColor: qr.customization?.cornersSquareColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    cornersDotsColor: qr.customization?.cornersDotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    dotsType: qr.customization?.dotsType ?? (qr.design?.pattern === 'dots' ? 'dots' : qr.design?.pattern === 'rounded' ? 'rounded' : 'square'),
                                                                    cornersSquareType: qr.customization?.cornersSquareType ?? 'square',
                                                                    cornersDotsType: qr.customization?.cornersDotsType ?? 'dot',
                                                                    width: 1024,
                                                                    height: 1024,
                                                                    errorCorrectionLevel: qr.customization?.errorCorrectionLevel ?? qr.design?.error_correction ?? 'M',
                                                                    imageSize: qr.customization?.imageSize ?? 0.2,
                                                                    gradientEnabled: qr.customization?.gradientEnabled ?? false,
                                                                    gradientType: qr.customization?.gradientType ?? 'linear',
                                                                    gradientStartColor: qr.customization?.gradientStartColor ?? '#000000',
                                                                    gradientEndColor: qr.customization?.gradientEndColor ?? '#000000',
                                                                    gradientRotation: qr.customization?.gradientRotation ?? 0,
                                                                    image: qr.customization?.image,
                                                                },
                                                                qr.name,
                                                                'png'
                                                            )}>
                                                                PNG
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => downloadStyledQRCode(
                                                                qr.content,
                                                                {
                                                                    dotsColor: qr.customization?.dotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    backgroundColor: qr.customization?.backgroundColor ?? qr.design?.background_color ?? '#ffffff',
                                                                    cornersSquareColor: qr.customization?.cornersSquareColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    cornersDotsColor: qr.customization?.cornersDotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    dotsType: qr.customization?.dotsType ?? (qr.design?.pattern === 'dots' ? 'dots' : qr.design?.pattern === 'rounded' ? 'rounded' : 'square'),
                                                                    cornersSquareType: qr.customization?.cornersSquareType ?? 'square',
                                                                    cornersDotsType: qr.customization?.cornersDotsType ?? 'dot',
                                                                    width: 1024,
                                                                    height: 1024,
                                                                    errorCorrectionLevel: qr.customization?.errorCorrectionLevel ?? qr.design?.error_correction ?? 'M',
                                                                    imageSize: qr.customization?.imageSize ?? 0.2,
                                                                    gradientEnabled: qr.customization?.gradientEnabled ?? false,
                                                                    gradientType: qr.customization?.gradientType ?? 'linear',
                                                                    gradientStartColor: qr.customization?.gradientStartColor ?? '#000000',
                                                                    gradientEndColor: qr.customization?.gradientEndColor ?? '#000000',
                                                                    gradientRotation: qr.customization?.gradientRotation ?? 0,
                                                                    image: qr.customization?.image,
                                                                },
                                                                qr.name,
                                                                'svg'
                                                            )}>
                                                                SVG
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => downloadStyledQRCode(
                                                                qr.content,
                                                                {
                                                                    dotsColor: qr.customization?.dotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    backgroundColor: qr.customization?.backgroundColor ?? qr.design?.background_color ?? '#ffffff',
                                                                    cornersSquareColor: qr.customization?.cornersSquareColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    cornersDotsColor: qr.customization?.cornersDotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    dotsType: qr.customization?.dotsType ?? (qr.design?.pattern === 'dots' ? 'dots' : qr.design?.pattern === 'rounded' ? 'rounded' : 'square'),
                                                                    cornersSquareType: qr.customization?.cornersSquareType ?? 'square',
                                                                    cornersDotsType: qr.customization?.cornersDotsType ?? 'dot',
                                                                    width: 1024,
                                                                    height: 1024,
                                                                    errorCorrectionLevel: qr.customization?.errorCorrectionLevel ?? qr.design?.error_correction ?? 'M',
                                                                    imageSize: qr.customization?.imageSize ?? 0.2,
                                                                    gradientEnabled: qr.customization?.gradientEnabled ?? false,
                                                                    gradientType: qr.customization?.gradientType ?? 'linear',
                                                                    gradientStartColor: qr.customization?.gradientStartColor ?? '#000000',
                                                                    gradientEndColor: qr.customization?.gradientEndColor ?? '#000000',
                                                                    gradientRotation: qr.customization?.gradientRotation ?? 0,
                                                                    image: qr.customization?.image,
                                                                },
                                                                qr.name,
                                                                'jpeg'
                                                            )}>
                                                                JPEG
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => downloadStyledQRCode(
                                                                qr.content,
                                                                {
                                                                    dotsColor: qr.customization?.dotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    backgroundColor: qr.customization?.backgroundColor ?? qr.design?.background_color ?? '#ffffff',
                                                                    cornersSquareColor: qr.customization?.cornersSquareColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    cornersDotsColor: qr.customization?.cornersDotsColor ?? qr.design?.foreground_color ?? '#000000',
                                                                    dotsType: qr.customization?.dotsType ?? (qr.design?.pattern === 'dots' ? 'dots' : qr.design?.pattern === 'rounded' ? 'rounded' : 'square'),
                                                                    cornersSquareType: qr.customization?.cornersSquareType ?? 'square',
                                                                    cornersDotsType: qr.customization?.cornersDotsType ?? 'dot',
                                                                    width: 1024,
                                                                    height: 1024,
                                                                    errorCorrectionLevel: qr.customization?.errorCorrectionLevel ?? qr.design?.error_correction ?? 'M',
                                                                    imageSize: qr.customization?.imageSize ?? 0.2,
                                                                    gradientEnabled: qr.customization?.gradientEnabled ?? false,
                                                                    gradientType: qr.customization?.gradientType ?? 'linear',
                                                                    gradientStartColor: qr.customization?.gradientStartColor ?? '#000000',
                                                                    gradientEndColor: qr.customization?.gradientEndColor ?? '#000000',
                                                                    gradientRotation: qr.customization?.gradientRotation ?? 0,
                                                                    image: qr.customization?.image,
                                                                },
                                                                qr.name,
                                                                'webp'
                                                            )}>
                                                                WebP
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* QR Details */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    {/* Name */}
                                                    <h3 className="text-lg font-semibold break-words" title={qr.name}>
                                                        {qr.name}
                                                    </h3>
                                                    
                                                    {/* Permalink */}
                                                    {qr.mode === 'dynamic' && qr.permalink && (
                                                        <p className="text-sm text-muted-foreground break-all">
                                                            {qr.permalink}
                                                        </p>
                                                    )}

                                                    {/* Type and Status Badges */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge 
                                                            variant="outline" 
                                                            className="rounded-full px-3"
                                                            style={{ 
                                                                backgroundColor: '#e9d5ff',
                                                                color: '#7c3aed',
                                                                borderColor: '#c4b5fd'
                                                            }}
                                                        >
                                                            {qr.type.toUpperCase()}
                                                        </Badge>
                                                        
                                                        {/* Status Toggle for Dynamic QR, Badge for Static */}
                                                        {qr.mode === 'dynamic' && view !== 'trash' ? (
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={qr.is_active}
                                                                    onCheckedChange={() => {
                                                                        router.patch(route('qr-codes.toggle-status', qr.id));
                                                                    }}
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    {qr.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Badge 
                                                                variant={qr.is_active ? "default" : "secondary"}
                                                                className="rounded-full px-3"
                                                                style={qr.is_active ? { 
                                                                    backgroundColor: '#e9d5ff',
                                                                    color: '#7c3aed',
                                                                    borderColor: '#c4b5fd'
                                                                } : {}}
                                                            >
                                                                {qr.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        )}
                                                    </div>


                                                    {/* Folder and Tags */}
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        {/* Folder */}
                                                        {qr.folder && (
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <FolderIcon className="w-4 h-4 text-blue-500" />
                                                                <span className="text-muted-foreground">{qr.folder.name}</span>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Tags */}
                                                        {qr.tags && qr.tags.length > 0 && (
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                {qr.tags.map((tag) => (
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
                                                        )}
                                                    </div>

                                                    {/* Stats - Made Bigger */}
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <span className="font-semibold text-base">Scans:</span>{' '}
                                                            <span className="text-base">{formatNumber(qr.scan_count)}</span>
                                                        </div>
                                                        {qr.last_scanned_at && (
                                                            <div className="text-sm">
                                                                <span className="font-medium">Last scan:</span>{' '}
                                                                <span className="text-muted-foreground">
                                                                    {new Date(qr.last_scanned_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Created Date */}
                                                <div className="flex-shrink-0 text-sm text-muted-foreground text-right min-w-[100px]">
                                                    <div className="font-medium text-foreground mb-1">Created date</div>
                                                    <div>{new Date(qr.created_at).toLocaleDateString()}</div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex-shrink-0 flex items-center gap-2">
                                                    {view === 'trash' ? (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    router.post(route('qr-codes.restore', qr.id));
                                                                }}
                                                            >
                                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                                Restore
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (confirm('Permanently delete this QR code? This cannot be undone.')) {
                                                                        router.delete(route('qr-codes.force-delete', qr.id));
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete Permanently
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                asChild
                                                                className="min-w-[80px]"
                                                            >
                                                                <Link href={`/qr-codes/${qr.id}`}>
                                                                    View
                                                                </Link>
                                                            </Button>
                                                            
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                asChild
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Link href={`/qr-codes/${qr.id}/edit`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                                                        <path d="m15 5 4 4"/>
                                                                    </svg>
                                                                </Link>
                                                            </Button>
                                                            
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => openMoveDialog([qr.id])}>
                                                                        <Move className="w-4 h-4 mr-2" />
                                                                        Move to Folder
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openTagsDialog([qr.id])}>
                                                                        <TagIcon className="w-4 h-4 mr-2" />
                                                                        Manage Tags
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        className="text-destructive"
                                                                        onClick={() => {
                                                                            router.delete(route('qr-codes.destroy', qr.id));
                                                                        }}
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredAndSortedQRCodes.length === 0 && (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <div className="text-6xl mb-4">📱</div>
                                        <h3 className="text-lg font-medium mb-2">No QR Codes Found</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {searchTerm || statusFilter !== 'all' || modeFilter !== 'all' || selectedFolderId !== null || selectedTagFilterId !== null
                                                ? "Try adjusting your filters"
                                                : "Create your first QR code to get started"}
                                        </p>
                                        <Button asChild>
                                            <Link href="/qr-codes/create">
                                                Create QR Code
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Folder Dialog */}
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{createFolderForm.data.parent_id ? 'Create Subfolder' : 'Create New Folder'}</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new folder.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Folder Name</Label>
                            <Input
                                id="name"
                                value={createFolderForm.data.name}
                                onChange={(e) => createFolderForm.setData('name', e.target.value)}
                                placeholder="e.g. Marketing Campaigns"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateFolder} disabled={!createFolderForm.data.name.trim() || createFolderForm.processing}>Create Folder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Folder Dialog */}
            <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Folder</DialogTitle>
                        <DialogDescription>
                            Update the folder name.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-folder-name">Folder Name</Label>
                            <Input
                                id="edit-folder-name"
                                value={editFolderForm.data.name}
                                onChange={(e) => editFolderForm.setData('name', e.target.value)}
                                placeholder="e.g. Marketing Campaigns"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditFolderOpen(false)}>Cancel</Button>
                        <Button onClick={submitEditFolder} disabled={!editFolderForm.data.name.trim() || editFolderForm.processing}>
                            Update Folder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Folder Dialog */}
            <Dialog open={isDeleteFolderOpen} onOpenChange={setIsDeleteFolderOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Folder</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{folderToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteFolderOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteFolder}>
                            Delete Folder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Tag Dialog */}
            <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Tag</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new tag.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tag-name">Tag Name</Label>
                            <Input
                                id="tag-name"
                                value={createTagForm.data.name}
                                onChange={(e) => createTagForm.setData('name', e.target.value)}
                                placeholder="e.g. Marketing"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateTagOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTag} disabled={!createTagForm.data.name.trim() || createTagForm.processing}>Create Tag</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Tag Dialog */}
            <Dialog open={isDeleteTagOpen} onOpenChange={setIsDeleteTagOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Tag</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{tagToDelete?.name}"? QR codes with this tag will not be deleted, only the tag association will be removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteTagOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteTag}>
                            Delete Tag
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                    <FolderIcon className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">No Folder (Root)</span>
                                </div>
                                {folders.filter(f => !f.parent_id).map((folder) => (
                                    <div
                                        key={folder.id}
                                        className={`flex items-center px-2 py-2 rounded-md cursor-pointer ${
                                            moveForm.data.folder_id === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                                        }`}
                                        onClick={() => moveForm.setData('folder_id', folder.id)}
                                    >
                                        <FolderIcon className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{folder.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {moveForm.data.folder_id && (
                            <div className="text-sm text-muted-foreground">
                                Selected: <span className="font-medium">{folders.find(f => f.id === moveForm.data.folder_id)?.name}</span>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleMoveQRCodes} disabled={moveForm.processing}>Move</Button>
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
                            <p className="text-xs text-muted-foreground">
                                Tip: Press Enter to quickly create a new tag
                            </p>
                        </div>

                        {/* Selected Tags */}
                        {tagsForm.data.tag_ids.length > 0 && (
                            <div className="space-y-2">
                                <Label>Selected Tags ({tagsForm.data.tag_ids.length})</Label>
                                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md min-h-[60px]">
                                    {tagsForm.data.tag_ids.map((tagId) => {
                                        const tag = tags.find(t => t.id === tagId);
                                        if (!tag) return null;
                                        return (
                                            <Badge
                                                key={tag.id}
                                                className="cursor-pointer pl-3 pr-1 py-1"
                                                style={{ 
                                                    backgroundColor: tag.color,
                                                    borderColor: tag.color,
                                                    color: '#fff'
                                                }}
                                                onClick={() => toggleTagSelection(tag.id)}
                                            >
                                                {tag.name}
                                                <button className="ml-1 hover:bg-black/20 rounded-full p-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Available Tags</span>
                            </div>
                        </div>

                        {/* Available Tags */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                                {tags.map((tag) => {
                                    const isSelected = tagsForm.data.tag_ids.includes(tag.id);
                                    if (isSelected) return null; // Don't show selected tags here
                                    return (
                                        <Badge
                                            key={tag.id}
                                            variant="outline"
                                            className="cursor-pointer hover:opacity-80"
                                            onClick={() => toggleTagSelection(tag.id)}
                                            style={{ 
                                                backgroundColor: tag.color + '20',
                                                color: tag.color,
                                                borderColor: tag.color + '40'
                                            }}
                                        >
                                            + {tag.name}
                                        </Badge>
                                    );
                                })}
                                {tags.filter(t => !tagsForm.data.tag_ids.includes(t.id)).length === 0 && (
                                    <span className="text-sm text-muted-foreground">All tags selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTagsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateTags} disabled={tagsForm.processing}>Save Tags</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}