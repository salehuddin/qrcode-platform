<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\Tag;
use Illuminate\Support\Str;

class TagService
{
    /**
     * Create a new tag.
     */
    public function createTag(Organization $organization, array $data): Tag
    {
        return $organization->tags()->create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'color' => $data['color'] ?? null,
        ]);
    }

    /**
     * Update an existing tag.
     */
    public function updateTag(Tag $tag, array $data): Tag
    {
        $tag->update($data);
        return $tag->refresh();
    }

    /**
     * Delete a tag.
     */
    public function deleteTag(Tag $tag): void
    {
        $tag->delete();
    }

    /**
     * Get all tags for an organization.
     */
    public function getTags(Organization $organization)
    {
        return $organization->tags()->orderBy('name')->get();
    }
}
