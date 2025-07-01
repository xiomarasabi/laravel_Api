<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Desarrollan extends Model
{
    use HasFactory;

    protected $table = 'desarrollan';

    protected $fillable = [
        'fk_id_cultivo',
        'fk_id_pea',
    ];

    public $timestamps = false;

    /**
     * Relación con el modelo Cultivo
     */
    public function cultivo(): BelongsTo
    {
        return $this->belongsTo(Cultivo::class, 'fk_id_cultivo', 'id');
    }

    /**
     * Relación con el modelo Pea
     */
    public function pea(): BelongsTo
    {
        return $this->belongsTo(Pea::class, 'fk_id_pea', 'id');
    }
}