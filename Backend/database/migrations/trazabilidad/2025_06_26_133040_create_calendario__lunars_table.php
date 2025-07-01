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
        Schema::create('calendario_lunar', function (Blueprint $table) {
            $table->id('id_calendario_lunar');
            $table->date('fecha')->nullable(false);
            $table->text('descripcion_evento')->nullable(false);
            $table->string('evento', 255)->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendario_lunar');
    }
};
