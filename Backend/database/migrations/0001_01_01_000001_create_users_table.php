<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->bigInteger('identificacion')->primary();
            $table->string('nombre', 50);
            $table->string('password', 200);
            $table->string('email')->unique();
            $table->timestamps();

            // ✅ Foreign key correcta
            $table->foreignId('fk_id_rol')->constrained('rols');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
