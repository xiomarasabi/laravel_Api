<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'notificacion';

    protected $primaryKey = 'id_notificacion';

    protected $fillable = [
        'titulo',
        'mensaje',
        'fk_id_programacion',
    ];

    public function programacion()
    {
        return $this->belongsTo(Programacion::class, 'fk_id_programacion');
    }
}
