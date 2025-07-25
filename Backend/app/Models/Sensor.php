<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{

    use HasFactory;

    protected $table = 'sensores';

    protected $fillable = [
        'nombre_sensor',
        'tipo_sensor',
        'unidad_medida',
        'descripcion',
        'medida_minima',
        'medida_maxima',
    ];
}



