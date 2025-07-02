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
        Schema::create('produccion', function (Blueprint $table) {
            $table->id(); // id autoincremental
            $table->decimal('cantidad_producida', 10, 2);
            $table->string('nombre_produccion', 50);
            $table->date('fecha_p   roduccion');
            $table->unsignedBigInteger('fk_id_lote');
            $table->unsignedBigInteger('fk_id_cultivo');
            $table->text('descripcion_produccion')->nullable();
            $table->string('estado', 20);
            $table->date('fecha_cosecha')->nullable();

            // Relaciones (foreign keys)
            $table->foreign('fk_id_lote')->references('id')->on('lote');
            $table->foreign('fk_id_cultivo')->references('id')->on('cultivo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produccion');
    }
};
