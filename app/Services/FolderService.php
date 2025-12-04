<?php

namespace App\Services;

use App\Models\Folder;
use App\Models\Organization;
use Illuminate\Support\Str;

class FolderService
{
    /**
     * Create a new folder.
     */
    public function createFolder(Organization $organization, array $data): Folder
    {
        return $organization->folders()->create([
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'color' => $data['color'] ?? null,
            'icon' => $data['icon'] ?? null,
            'order' => $data['order'] ?? 0,
        ]);
    }

    /**
     * Update an existing folder.
     */
    public function updateFolder(Folder $folder, array $data): Folder
    {
        $folder->update($data);
        return $folder->refresh();
    }

    /**
     * Delete a folder.
     */
    public function deleteFolder(Folder $folder): void
    {
        $folder->delete();
    }

    /**
     * Get the folder tree for an organization.
     */
    public function getFolderTree(Organization $organization)
    {
        return $organization->folders()
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('order')
            ->get();
    }

    /**
     * Move a folder to a new parent.
     */
    public function moveFolder(Folder $folder, ?Folder $newParent): void
    {
        // Prevent moving a folder into itself or its children
        if ($newParent && ($folder->id === $newParent->id || $this->isChildOf($newParent, $folder))) {
            throw new \InvalidArgumentException("Cannot move folder into itself or its descendants.");
        }

        $folder->update(['parent_id' => $newParent?->id]);
    }

    /**
     * Check if a folder is a child of another folder (recursive).
     */
    protected function isChildOf(Folder $folder, Folder $potentialParent): bool
    {
        $parent = $folder->parent;
        while ($parent) {
            if ($parent->id === $potentialParent->id) {
                return true;
            }
            $parent = $parent->parent;
        }
        return false;
    }
}
