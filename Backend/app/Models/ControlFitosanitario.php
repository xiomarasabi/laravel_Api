<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlFitosanitario extends Model
{
    use HasFactory;

    protected $table = 'control_fitosanitario';

    protected $fillable = [
        'fecha_control',
        'descripcion',
        'fk_id_desarrollan',
        'detalle', // Añadido para consistencia con frontend
    ];

    public $timestamps = false;

    public function desarrollan()
    {
        return $this->belongsTo(Desarrollan::class, 'fk_id_desarrollan');
    }
}