<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $credentials = $request->only('identificacion', 'password');

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->respondWithToken($token);
    }

    // Obtener usuario autenticado
    public function me()
    {
        return response()->json(Auth::user());
    }

    // Cerrar sesión
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    // Refrescar token
    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }

    // Formato de respuesta del token
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60
        ]);
    }
}
