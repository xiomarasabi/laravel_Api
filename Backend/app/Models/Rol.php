<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'rols';

    protected $fillable = [
        'nombre_rol',
        'fecha_creacion',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'fk_id_rol');
    }
}
