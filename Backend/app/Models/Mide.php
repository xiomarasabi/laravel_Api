<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mide extends Model
{
    use HasFactory;

    protected $table = 'mide';

    protected $fillable = [
        'fk_id_sensor',
        'fk_id_era',
        'valor_medicion',
        'fecha_medicion',
    ];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class, 'fk_id_sensor');
    }

    public function era()
    {
        return $this->belongsTo(Era::class, 'fk_id_era');
    }
}