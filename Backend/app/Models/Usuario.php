<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Str;

class Usuario extends Authenticatable implements JWTSubject
{
    use Notifiable;
    use HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'identificacion';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'identificacion',
        'nombre',
        'password',
        'email',
        'fk_id_rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relación con Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'fk_id_rol');
    }

    // Encriptar contraseña automáticamente
    public function setPasswordAttribute($value)
    {
        if (!Str::startsWith($value, '$2y$')) {
            $this->attributes['password'] = bcrypt($value);
        } else {
            $this->attributes['password'] = $value;
        }
    }

    // Métodos requeridos por JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
