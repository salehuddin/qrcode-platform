<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('qr_scans', function (Blueprint $table) {
            $table->index('device_type');
            $table->index('country');
            $table->index('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('qr_scans', function (Blueprint $table) {
            $table->dropIndex(['device_type']);
            $table->dropIndex(['country']);
            $table->dropIndex(['ip_address']);
        });
    }
};
