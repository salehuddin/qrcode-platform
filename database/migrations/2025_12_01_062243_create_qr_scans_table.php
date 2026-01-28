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
        Schema::create('qr_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('qr_code_id')->constrained('qr_codes')->onDelete('cascade');
            $table->string('ip_address', 191)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type', 191)->nullable(); // Mobile, Desktop, Tablet
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('country', 191)->nullable();
            $table->string('city')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamp('scanned_at');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('qr_code_id');
            $table->index('scanned_at');
            $table->index(['qr_code_id', 'scanned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_scans');
    }
};
