<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Desarrollan extends Model
{
    use HasFactory;

    protected $table = 'desarrollan';

    protected $fillable = [
        'fk_id_cultivo',
        'fk_id_pea',
    ];

    public $timestamps = false;
}