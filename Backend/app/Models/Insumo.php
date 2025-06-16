<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insumo extends Model
{
    use HasFactory;

    protected $table = 'insumos';

    protected $fillable = [
        'nombre',
        'tipo',
        'cantidad',
        'fecha_vencimiento',
        'precio_unidad',
        'unidad_medida',
    ];

    public $timestamps = false; 
}
