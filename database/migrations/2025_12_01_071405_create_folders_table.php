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
        Schema::create('folders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('folders')->onDelete('cascade');
            $table->string('name');
            $table->string('slug', 191);
            $table->text('description')->nullable();
            $table->string('color')->nullable(); // Hex color for UI
            $table->string('icon')->nullable(); // Icon name for UI
            $table->integer('order')->default(0); // For custom ordering
            $table->timestamps();
            
            $table->unique(['organization_id', 'parent_id', 'slug']);
            $table->index(['organization_id', 'parent_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('folders');
    }
};
