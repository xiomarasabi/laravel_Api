<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asignacion_actividades', function (Blueprint $table) {
            $table->id('id_asignacion_actividad');
            $table->date('fecha');
            $table->unsignedBigInteger('fk_id_actividad');
            $table->bigInteger('fk_identificacion');
            $table->foreign('fk_id_actividad')->references('id_actividad')->on('actividad')->onDelete('cascade');
            $table->foreign('fk_identificacion')->references('identificacion')->on('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asignacion_actividades');
    }
};
