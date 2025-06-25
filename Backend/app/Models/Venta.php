<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'venta'; // nombre exacto de la tabla

    public $timestamps = false; // porque no tiene created_at ni updated_at

    protected $fillable = [
        'fk_id_produccion',
        'cantidad',
        'precio_unitario',
        'total_venta',
        'fecha_venta',
    ];

    // Relación con Producción
    public function produccion()
    {
        return $this->belongsTo(Produccion::class, 'fk_id_produccion');
    }
}
