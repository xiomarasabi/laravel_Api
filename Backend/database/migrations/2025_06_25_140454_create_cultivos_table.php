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
        Schema::create('cultivos', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_plantacion');
            $table->string('nombre_cultivo', 100);
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('fk_id_especie');
            $table->unsignedBigInteger('fk_id_semillero');
            $table->foreign('fk_id_especie')->references('id')->on('especies')->onDelete('cascade');
            $table->foreign('fk_id_semillero')->references('id')->on('semilleros')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cultivos');
    }
};
