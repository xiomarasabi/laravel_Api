<?php

namespace App\Http\Controllers;

use App\Models\Semillero;
use Illuminate\Http\Request;

class SemilleroController extends Controller
{
    public function index()
    {
        $semilleros = Semillero::all();
        return response()->json($semilleros);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_semilla' => 'required|string|max:100',
            'fecha_siembra' => 'required|date',
            'fecha_estimada' => 'required|date|after_or_equal:fecha_siembra',
            'cantidad' => 'required|integer|min:1',
        ]);

        $semillero = Semillero::create($request->all());

        return response()->json([
            'msg' => 'Semillero registrado con éxito',
            'semillero' => $semillero
        ], 201);
    }

    public function show($id)
    {
        $semillero = Semillero::findOrFail($id);
        return response()->json($semillero);
    }

    public function update(Request $request, $id)
    {
        $semillero = Semillero::findOrFail($id);

        $request->validate([
            'nombre_semilla' => 'string|max:100',
            'fecha_siembra' => 'date',
            'fecha_estimada' => 'date|after_or_equal:fecha_siembra',
            'cantidad' => 'integer|min:1',
        ]);

        $semillero->update($request->all());

        return response()->json($semillero);
    }

    public function destroy($id)
    {
        $semillero = Semillero::findOrFail($id);
        $semillero->delete();

        return response()->json(['msg' => 'Semillero eliminado correctamente']);
    }
}
