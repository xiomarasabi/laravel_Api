<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::with('rol')->get();
        return response()->json($usuarios);
    }

    public function store(Request $request)
    {
        $hayUsuarios = Usuario::count() > 0;

        $request->validate([
            'identificacion' => 'required|numeric|min:0|unique:usuarios,identificacion',
            'nombre' => 'required|string|max:50',
            'password' => 'required|string|max:200',
            'email' => 'required|email|unique:usuarios,email',
            'fk_id_rol' => $hayUsuarios ? 'required|exists:rols,id' : 'nullable',
        ]);
        
        $usuario = Usuario::create($request->all());
        $usuario->load('rol');

        return response()->json($usuario, 201);
    }

    public function show($identificacion)
    {
        $usuario = Usuario::with('rol')->findOrFail($identificacion);
        return response()->json($usuario);
    }

    public function update(Request $request, $identificacion)
    {
        $usuario = Usuario::findOrFail($identificacion);

        $request->validate([
            'identificacion' => 'required|numeric|min:0',
            'nombre' => 'required|string|max:50',
            'password' => 'required|string|max:200',
            'email' => 'required|email|unique:usuarios,email,' . $identificacion . ',identificacion',
            'fk_id_rol' => 'required|exists:rols,id',
        ]);

        $usuario->update($request->all());
        $usuario->load('rol');

        return response()->json($usuario);
    }

    public function destroy($identificacion)
    {
        $usuario = Usuario::findOrFail($identificacion);
        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
