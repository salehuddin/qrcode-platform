<?php

namespace Database\Seeders;

use App\Models\Folder;
use App\Models\Organization;
use App\Models\Tag;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure we have a default organization
        $org = Organization::firstOrCreate(
            ['slug' => 'default-organization'],
            [
                'name' => 'Default Organization',
                'is_active' => true,
            ]
        );

        // 2. Create some folders
        $marketing = Folder::firstOrCreate(
            ['organization_id' => $org->id, 'slug' => 'marketing'],
            ['name' => 'Marketing', 'color' => '#3b82f6', 'icon' => 'Megaphone']
        );

        $social = Folder::firstOrCreate(
            ['organization_id' => $org->id, 'slug' => 'social-media', 'parent_id' => $marketing->id],
            ['name' => 'Social Media', 'color' => '#8b5cf6', 'icon' => 'Share']
        );

        $print = Folder::firstOrCreate(
            ['organization_id' => $org->id, 'slug' => 'print-materials', 'parent_id' => $marketing->id],
            ['name' => 'Print Materials', 'color' => '#10b981', 'icon' => 'Printer']
        );

        // 3. Create some tags
        $tags = [
            ['name' => 'Urgent', 'slug' => 'urgent', 'color' => '#ef4444'],
            ['name' => 'Q4 Campaign', 'slug' => 'q4-campaign', 'color' => '#f59e0b'],
            ['name' => 'Client: Acme', 'slug' => 'client-acme', 'color' => '#6366f1'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['organization_id' => $org->id, 'slug' => $tag['slug']],
                $tag
            );
        }

        // 4. Create a team
        $team = Team::firstOrCreate(
            ['organization_id' => $org->id, 'name' => 'Marketing Team'],
            ['description' => 'Handles all marketing QR codes']
        );

        // 5. Assign existing users to organization and team
        $users = User::all();
        foreach ($users as $user) {
            // Add to organization as admin if not already
            if (!$user->organizations()->where('organization_id', $org->id)->exists()) {
                $user->organizations()->attach($org->id, ['role' => 'admin']);
            }

            // Add to team
            if (!$user->teams()->where('team_id', $team->id)->exists()) {
                $user->teams()->attach($team->id);
            }
        }
    }
}
