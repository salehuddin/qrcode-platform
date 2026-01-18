<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QRCode extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'qr_codes';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'organization_id',
        'folder_id',
        'team_id',
        'name',
        'description',
        'type',
        'mode',
        'content',
        'permalink',
        'destination_url',
        'is_active',
        'scan_count',
        'unique_scans',
        'last_scanned_at',
        'design',
        'customization',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'scan_count' => 'integer',
            'unique_scans' => 'integer',
            'last_scanned_at' => 'datetime',
            'design' => 'array',
            'customization' => 'array',
        ];
    }

    /**
     * Get the user that owns the QR code.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all scans for this QR code.
     */
    public function scans()
    {
        return $this->hasMany(QrScan::class, 'qr_code_id');
    }

    /**
     * Get the organization that owns this QR code.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the folder this QR code belongs to.
     */
    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    /**
     * Get the team this QR code is assigned to.
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get all tags for this QR code.
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'qr_code_tag', 'qr_code_id', 'tag_id')->withTimestamps();
    }
}
