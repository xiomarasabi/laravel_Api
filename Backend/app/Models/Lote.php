<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lote extends Model
{
    use HasFactory;

    protected $table = 'lotes';
    protected $primaryKey = 'id';

    protected $fillable = [
        'dimension',
        'nombre_lote',
        'fk_id_ubicacion',
        'estado',
    ];

    public $timestamps = false;
}