<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cultivo extends Model
{
    use HasFactory;

    protected $table = 'cultivos';

    protected $fillable = [
        'fecha_plantacion',
        'nombre_cultivo',
        'descripcion',
        'fk_id_especie',
        'fk_id_semillero',
    ];

    public $timestamps = false;
}