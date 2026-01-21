<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class PlatformAdminSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Make the first user a platform admin
        $firstUser = User::orderBy('id')->first();
        
        if ($firstUser) {
            $firstUser->update(['is_platform_admin' => true]);
            $this->command->info("User '{$firstUser->name}' ({$firstUser->email}) is now a platform admin.");
        } else {
            $this->command->warn('No users found. Please create a user first, then run this seeder.');
        }
    }
}
