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
        Schema::create('realiza', function (Blueprint $table) {
            $table->id('id_realiza');
            $table->unsignedBigInteger('fk_id_cultivo');
            $table->unsignedBigInteger('fk_id_actividad');
            $table->foreign('fk_id_cultivo')->references('id_cultivo')->on('cultivo')->onDelete('cascade');
            $table->foreign('fk_id_actividad')->references('id_actividad')->on('actividad')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realiza');
    }
};
