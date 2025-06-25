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
    ];

    public $timestamps = false;
}