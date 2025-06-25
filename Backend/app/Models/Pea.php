<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pea extends Model
{
    use HasFactory;

    protected $table = 'peas';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public $timestamps = false;
}