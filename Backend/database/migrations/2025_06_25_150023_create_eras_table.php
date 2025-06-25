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
        Schema::create('eras', function (Blueprint $table) {
            $table->id();
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('fk_id_lote');
            $table->enum('estado', ['Activo', 'Inactivo'])->default('Activo');
            $table->foreign('fk_id_lote')->references('id')->on('lotes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eras');
    }
};