<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    protected $table = 'actividad';

    protected $primaryKey = 'id_actividad';

    protected $fillable = [
        'nombre_actividad',
        'descripcion',
    ];
}
