<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programacion extends Model
{
    protected $table = 'programacion';

    protected $primaryKey = 'id_programacion';

    protected $fillable = [
        'estado',
        'fecha_programada',
        'duracion',
        'fk_id_asignacion_actividad',
        'fk_id_calendario_lunar',
    ];

    public function asignacionActividades()
    {
        return $this->belongsTo(Asignacion_Actividades::class, 'fk_id_asignacion_actividad');
    }

    public function calendarioLunar()
    {
        return $this->belongsTo(CalendarioLunar::class, 'fk_id_calendario_lunar');
    }
}
