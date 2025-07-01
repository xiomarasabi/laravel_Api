<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarioLunar extends Model
{
    protected $table = 'calendario_lunar';

    protected $primaryKey = 'id_calendario_lunar';

    protected $fillable = [
        'fecha',
        'descripcion_evento',
        'evento',
    ];
}
