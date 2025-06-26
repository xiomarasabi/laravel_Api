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
        Schema::create('especies', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_comun', 100);
            $table->string('nombre_cientifico', 100);
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('fk_id_tipo_cultivo');
            $table->foreign('fk_id_tipo_cultivo')->references('id')->on('tipo_cultivos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especies');
    }
};