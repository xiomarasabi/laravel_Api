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
        Schema::create('programacion', function (Blueprint $table) {
            $table->id('id_programacion');
            $table->enum('estado', ['pendiente', 'completado', 'cancelado'])->default('pendiente');
            $table->date('fecha_programada');
            $table->time('duracion');
            $table->unsignedBigInteger('fk_id_asignacion_actividad');
            $table->unsignedBigInteger('fk_id_calendario_lunar');
            $table->foreign('fk_id_asignacion_actividad')->references('id_asignacion_actividad')->on('asignacion_actividades')->onDelete('cascade');
            $table->foreign('fk_id_calendario_lunar')->references('id_calendario_lunar')->on('calendario_lunar')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programacion');
    }
};
