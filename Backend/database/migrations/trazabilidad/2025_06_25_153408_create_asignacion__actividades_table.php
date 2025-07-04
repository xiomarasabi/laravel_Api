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
        Schema::create('asignacion__actividades', function (Blueprint $table) {
            $table->id('id_asignacion_actividad');
            $table->date('fecha');
            $table->unsignedBigInteger('fk_id_actividad');
            $table->unsignedBigInteger('fk_identificacion');
            $table->timestamps();

            $table->foreign('fk_id_actividad')->references('id')->on('actividad')->onDelete('cascade');
            $table->foreign('fk_identificacion')->references('id')->on('identificacion')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignacion__actividades');
    }
};
