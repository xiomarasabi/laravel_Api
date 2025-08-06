<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Realiza extends Model
{
    use HasFactory;

    protected $table = 'realiza';
    protected $primaryKey = 'id_realiza';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'fk_id_cultivo',
        'fk_id_actividad',
    ];

    // Relación con Cultivo
    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'fk_id_cultivo', 'id');
    }

    // Relación con Actividad
    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'fk_id_actividad', 'id_actividad');
    }
}
