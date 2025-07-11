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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique(); // Stock Keeping Unit
            $table->string('barcode')->nullable(); // For barcode scanning
            $table->text('description')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->decimal('cost_price', 10, 2); // Cost in PHP
            $table->decimal('selling_price', 10, 2); // Selling price in PHP
            $table->integer('reorder_level')->default(10); // When to reorder
            $table->integer('current_stock')->default(0);
            $table->string('unit')->default('pcs'); // Unit of measurement (pcs, kg, liters, etc.)
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->text('specifications')->nullable(); // JSON or text for product specs
            $table->string('supplier_code')->nullable(); // Supplier's product code
            $table->boolean('is_active')->default(true);
            $table->string('image_path')->nullable(); // Product image
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
