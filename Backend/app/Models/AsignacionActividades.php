<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsignacionActividades extends Model
{
    use HasFactory;

    protected $table = 'asignacion_actividades';

    protected $fillable = [
        'fecha',
        'fk_id_actividad',
        'fk_identificacion',
    ];

    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'fk_id_actividad', 'id_actividad');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'fk_identificacion', 'id');
    }
}
