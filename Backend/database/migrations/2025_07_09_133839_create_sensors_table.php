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
        Schema::create('sensores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_sensor');
            $table->string('tipo_sensor');
            $table->string('unidad_medida');
            $table->text('descripcion')->nullable();
            $table->decimal('medida_minima', 8, 2);
            $table->decimal('medida_maxima', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensores');
    }
};