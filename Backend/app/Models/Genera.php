<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genera extends Model
{
    use HasFactory;

    protected $table = 'generas';

    protected $fillable = [
        'fk_ventas',
        'fk_produccion'
    ];

    public function Venta()
    {
        return $this->belongsTo(Venta::class, 'fk_ventas');
    }
    public function Produccion()
    {
        return $this->belongsTo(Produccion::class, 'fk_produccion');
    }
    
}
