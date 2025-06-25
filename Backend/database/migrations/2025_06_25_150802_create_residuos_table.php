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
        Schema::create('residuos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->date('fecha');
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('fk_id_tipo_residuo');
            $table->unsignedBigInteger('fk_id_cultivo');
            $table->foreign('fk_id_tipo_residuo')->references('id')->on('tipo_residuos')->onDelete('cascade');
            $table->foreign('fk_id_cultivo')->references('id')->on('cultivos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residuos');
    }
};