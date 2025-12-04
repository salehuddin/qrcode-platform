import { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, MoreVertical, Plus, Pencil, Trash, FolderOpen } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { Folder } from '@/types';

// Remove local Folder interface


interface FolderTreeProps {
    folders: Folder[];
    onSelect?: (folder: Folder) => void;
    onCreateSubfolder?: (parentId: number) => void;
    onEdit?: (folder: Folder) => void;
    onDelete?: (folder: Folder) => void;
    level?: number;
}

export default function FolderTree({ folders, onSelect, onCreateSubfolder, onEdit, onDelete, level = 0 }: FolderTreeProps) {
    if (!folders || folders.length === 0) {
        return null;
    }

    return (
        <ul className="space-y-1">
            {folders.map((folder) => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    onSelect={onSelect}
                    onCreateSubfolder={onCreateSubfolder}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    level={level}
                />
            ))}
        </ul>
    );
}

function FolderItem({ folder, onSelect, onCreateSubfolder, onEdit, onDelete, level }: { folder: Folder } & Omit<FolderTreeProps, 'folders'>) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = folder.children && folder.children.length > 0;

    return (
        <li>
            <div
                className={cn(
                    "flex items-center group py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                    (level || 0) > 0 && "ml-4"
                )}
            >
                <div
                    className="p-1 mr-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                >
                    {hasChildren ? (
                        isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </div>

                <div
                    className="flex-1 flex items-center space-x-2"
                    onClick={() => onSelect?.(folder)}
                >
                    {isOpen ? (
                        <FolderOpen className="w-4 h-4 text-blue-500" />
                    ) : (
                        <FolderIcon className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{folder.name}</span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="w-3 h-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onCreateSubfolder?.(folder.id)}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Subfolder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(folder)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Rename / Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(folder)}>
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {isOpen && hasChildren && (
                <FolderTree
                    folders={folder.children || []}
                    onSelect={onSelect}
                    onCreateSubfolder={onCreateSubfolder}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    level={(level || 0) + 1}
                />
            )}
        </li>
    );
}
