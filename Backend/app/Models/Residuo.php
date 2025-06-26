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

    public function tipo_residuo()
    {
        return $this->belongsTo(TipoResiduo::class, 'fk_id_tipo_residuo');
    }

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'fk_id_cultivo');
    }
}