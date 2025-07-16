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
        Schema::create('mide', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fk_id_sensor');
            $table->unsignedBigInteger('fk_id_era');
            $table->decimal('valor_medicion', 8, 2);
            $table->timestamp('fecha_medicion')->useCurrent();
            $table->foreign('fk_id_sensor')->references('id')->on('sensores')->onDelete('cascade');
            $table->foreign('fk_id_era')->references('id')->on('eras')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mide');
    }
};