<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TipoCultivo;

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

    // ✅ Relación con tipo_cultivo
    public function tipoCultivo()
    {
        return $this->belongsTo(TipoCultivo::class, 'fk_id_tipo_cultivo', 'id');
    }
}
