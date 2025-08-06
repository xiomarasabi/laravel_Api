<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semillero extends Model
{
    use HasFactory;

    protected $table = 'semilleros';

    protected $fillable = [
        'nombre_semilla',
        'fecha_siembra',
        'fecha_estimada',
        'cantidad',
    ];

    public $timestamps = false;

    public function cultivos()
    {
        return $this->hasMany(Cultivo::class, 'fk_id_semillero');
    }
}