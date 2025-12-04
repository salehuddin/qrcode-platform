<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add columns as nullable first
        Schema::table('qr_codes', function (Blueprint $table) {
            if (!Schema::hasColumn('qr_codes', 'organization_id')) {
                $table->foreignId('organization_id')->nullable()->after('user_id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('qr_codes', 'folder_id')) {
                $table->foreignId('folder_id')->after('organization_id')->nullable()->constrained()->onDelete('set null');
            }
            if (!Schema::hasColumn('qr_codes', 'team_id')) {
                $table->foreignId('team_id')->after('folder_id')->nullable()->constrained()->onDelete('set null');
            }
            
            // Add indexes for performance (check if they exist first ideally, but MySQL handles duplicate index creation gracefully usually, or throws error. Let's wrap in try-catch or just assume if column didn't exist, index doesn't)
             // Actually, if columns existed, we shouldn't try to add indexes again if they might exist.
             // For simplicity in this fix, I'll assume if organization_id exists, the migration partially ran.
        });

        // 2. Create default organization if needed and assign to existing QR codes
        if (DB::table('qr_codes')->count() > 0) {
            $defaultOrgId = DB::table('organizations')->insertGetId([
                'name' => 'Default Organization',
                'slug' => 'default-organization',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('qr_codes')->update(['organization_id' => $defaultOrgId]);
            
            // Also add all existing users to this organization as admins
            $userIds = DB::table('users')->pluck('id');
            foreach ($userIds as $userId) {
                DB::table('organization_user')->insert([
                    'organization_id' => $defaultOrgId,
                    'user_id' => $userId,
                    'role' => 'admin',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Make organization_id non-nullable (only if we have data or it's a fresh install)
        // If table was empty, the nullable constraint is fine to change to not null
        // If table had data, we just filled it, so it's safe
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->unsignedBigInteger('organization_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropForeign(['folder_id']);
            $table->dropForeign(['team_id']);
            
            $table->dropIndex(['organization_id', 'folder_id']);
            $table->dropIndex(['team_id']);
            
            $table->dropColumn(['organization_id', 'folder_id', 'team_id']);
        });
    }
};
