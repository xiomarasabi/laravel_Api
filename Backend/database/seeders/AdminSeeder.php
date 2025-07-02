<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Rol;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (Usuario::count() === 0) {
            // Crear rol Administrador si no existe
            $rolAdmin = Rol::firstOrCreate(
                ['nombre_rol' => 'Administrador'],
                ['fecha_creacion' => now()]
            );

            // Crear usuario por defecto
            Usuario::create([
                'identificacion' => 1234567,
                'nombre' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => '1234567', // se encripta automáticamente desde el modelo
                'fk_id_rol' => $rolAdmin->id,
            ]);
        }
    }
}
