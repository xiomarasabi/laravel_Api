<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoResiduo extends Model
{
    use HasFactory;

    protected $table = 'tipo_residuos';

    protected $fillable = [
        'nombre_residuo',
        'descripcion',
    ];

    public $timestamps = false;
}