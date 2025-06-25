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
        Schema::create('lotes', function (Blueprint $table) {
            $table->id('id');
            $table->double('dimension', 15, 2);
            $table->string('nombre_lote', 100);
            $table->unsignedBigInteger('fk_id_ubicacion');
            $table->enum('estado', ['Activo', 'Inactivo'])->default('Activo');
            $table->foreign('fk_id_ubicacion')->references('id_ubicacion')->on('ubicaciones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lotes');
    }
};