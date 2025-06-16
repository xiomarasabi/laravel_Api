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
        Schema::create('herramientas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('cantidad');
            $table->enum('estado', ['Disponible', 'Dañada', 'Reparacion'])->default('Disponible');
            $table->double('precio', 15, 4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('herramientas');
    }
};
