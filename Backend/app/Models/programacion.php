<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programacion extends Model
{
    use HasFactory;

    protected $table = 'programacion';
    protected $primaryKey = 'id_programacion';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'estado',
        'fecha_programada',
        'duracion',
        'fk_id_asignacion_actividad',
        'fk_id_calendario_lunar',
    ];

    protected $casts = [
        'fecha_programada' => 'date',
        'duracion' => 'datetime',
    ];

    // Relación con AsignacionActividades
    public function asignacionActividad()
    {
        return $this->belongsTo(AsignacionActividades::class, 'fk_id_asignacion_actividad', 'id_asignacion_actividad');
    }

    // Relación con CalendarioLunar
    public function calendarioLunar()
    {
        return $this->belongsTo(CalendarioLunar::class, 'fk_id_calendario_lunar', 'id_calendario_lunar');
    }
}
