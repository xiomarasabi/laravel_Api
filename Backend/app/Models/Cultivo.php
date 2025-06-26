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

    public function especie()
    {
        return $this->belongsTo(Especie::class, 'fk_id_especie');
    }

    public function semillero()
    {
        return $this->belongsTo(Semillero::class, 'fk_id_semillero');
    }
}