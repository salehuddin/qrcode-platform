<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'parent_id',
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the organization that owns this folder.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the parent folder.
     */
    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * Get all child folders.
     */
    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id')->orderBy('order');
    }

    /**
     * Get all QR codes in this folder.
     */
    public function qrCodes()
    {
        return $this->hasMany(QrCode::class);
    }

    /**
     * Get the full path of this folder.
     */
    public function getPathAttribute()
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $path);
    }
}
