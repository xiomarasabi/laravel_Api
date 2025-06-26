<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Era extends Model
{
    use HasFactory;

    protected $table = 'eras';

    protected $fillable = [
        'descripcion',
        'fk_id_lote',
        'estado',
    ];

    public $timestamps = false;
}