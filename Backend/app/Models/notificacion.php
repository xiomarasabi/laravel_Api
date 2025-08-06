<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificacion';
    protected $primaryKey = 'id_notificacion';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'titulo',
        'mensaje',
        'fk_id_programacion',
    ];

    // Relación con Programacion
    public function programacion()
    {
        return $this->belongsTo(Programacion::class, 'fk_id_programacion', 'id_programacion');
    }
}
