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
        Schema::create('desarrollan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fk_id_cultivo');
            $table->unsignedBigInteger('fk_id_pea');
            $table->foreign('fk_id_cultivo')->references('id')->on('cultivos')->onDelete('cascade');
            $table->foreign('fk_id_pea')->references('id')->on('peas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desarrollan');
    }
};