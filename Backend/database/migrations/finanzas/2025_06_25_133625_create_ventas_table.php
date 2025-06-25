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
        Schema::create('venta', function (Blueprint $table) {
            $table->id(); // id SERIAL PRIMARY KEY
            $table->unsignedBigInteger('fk_id_produccion'); // FK a produccion
            $table->decimal('cantidad', 10, 2);
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('total_venta', 10, 2);
            $table->date('fecha_venta');

            // Clave foránea a produccion(id)
            $table->foreign('fk_id_produccion')->references('id')->on('produccion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta');
    }
};
