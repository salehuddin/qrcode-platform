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
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->text('content');
            $table->string('destination_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('scan_count')->default(0);
            $table->unsignedBigInteger('unique_scans')->default(0);
            $table->timestamp('last_scanned_at')->nullable();
            $table->json('design')->nullable();
            $table->json('customization')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
