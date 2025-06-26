<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plantacion extends Model
{
    use HasFactory;

    protected $table = 'plantacions';

    protected $fillable = [
        'fk_id_cultivo',
        'fk_id_era',
    ];

    public $timestamps = false;
}