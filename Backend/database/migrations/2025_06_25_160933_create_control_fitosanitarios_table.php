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
        Schema::create('control_fitosanitario', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_control');
            $table->text('descripcion');
            $table->unsignedBigInteger('fk_id_desarrollan');
            $table->foreign('fk_id_desarrollan')->references('id')->on('desarrollan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('control_fitosanitario');
    }
};