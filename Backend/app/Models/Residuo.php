<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Residuo extends Model
{
    use HasFactory;

    protected $table = 'residuos';

    protected $fillable = [
        'nombre',
        'fecha',
        'descripcion',
        'fk_id_tipo_residuo',
        'fk_id_cultivo',
    ];

    public $timestamps = false;
}