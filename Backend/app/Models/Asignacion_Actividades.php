<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asignacion_Actividades extends Model
{
    protected $table = 'asignacion__actividades';
    protected $primaryKey = 'id_asignacion_actividad';
    protected $fillable = [
        'fecha',
        'fk_id_actividad',
        'fk_identificacion'
    ];

    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'fk_id_actividad');
    }

    public function identificacion()
    {
        return $this->belongsTo(Identificacion::class, 'fk_identificacion');
    }
}
