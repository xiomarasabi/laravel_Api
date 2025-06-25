<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produccion extends Model
{
    use HasFactory;

    protected $table = 'produccion'; 

    protected $fillable = [
        'cantidad_producida',
        'nombre_produccion',
        'fecha_produccion',
        'fk_id_lote',
        'fk_id_cultivo',
        'descripcion_produccion',
        'estado',
        'fecha_cosecha',
    ];

    public $timestamps = false;

    // Relaciones
    public function lote()
    {
        return $this->belongsTo(Lote::class, 'fk_id_lote');
    }

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'fk_id_cultivo');
    }
}
