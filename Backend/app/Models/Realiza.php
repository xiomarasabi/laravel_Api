<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Realiza extends Model
{
    protected $table = 'realiza';

    protected $primaryKey = 'id_realiza';

    protected $fillable = [
        'fk_id_cultivo',
        'fk_id_actividad',
    ];

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'fk_id_cultivo');
    }

    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'fk_id_actividad');
    }
}
