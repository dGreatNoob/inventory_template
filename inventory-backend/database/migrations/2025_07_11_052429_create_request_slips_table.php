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
        Schema::create('request_slips', function (Blueprint $table) {
            $table->id();
            $table->string('slip_number', 50)->unique();
            $table->date('request_date');
            $table->string('requested_by', 100);
            $table->string('department', 100);
            $table->string('purpose');
            $table->enum('status', ['pending', 'approved', 'rejected', 'issued'])->default('pending');
            $table->string('approved_by', 100)->nullable();
            $table->date('approved_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_slips');
    }
};
