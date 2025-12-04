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
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('mode')->default('dynamic')->after('type'); // static, dynamic
            $table->string('permalink')->nullable()->unique()->after('content'); // for dynamic QRs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->dropColumn(['description', 'mode', 'permalink']);
        });
    }
};
