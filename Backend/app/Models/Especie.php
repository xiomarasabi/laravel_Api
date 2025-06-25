<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Especie extends Model
{
    use HasFactory;

    protected $table = 'especies';

    protected $fillable = [
        'nombre_comun',
        'nombre_cientifico',
        'descripcion',
        'fk_id_tipo_cultivo',
    ];

    public $timestamps = false;
}