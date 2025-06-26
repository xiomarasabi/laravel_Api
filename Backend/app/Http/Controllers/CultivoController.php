<?php

namespace App\Http\Controllers;

use App\Models\Cultivo;
use Illuminate\Http\Request;

class CultivoController extends Controller
{
    public function index()
    {
        $cultivos = Cultivo::with('especie', 'semillero')->get();
        return response()->json($cultivos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha_plantacion' => 'required|date',
            'nombre_cultivo' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'fk_id_especie' => 'required|exists:especies,id',
            'fk_id_semillero' => 'required|exists:semilleros,id',
        ]);

        $cultivo = Cultivo::create($request->all());
        $cultivo->load('especie', 'semillero');
        return response()->json($cultivo, 201);
    }

    public function show($id)
    {
        $cultivo = Cultivo::with('especie', 'semillero')->findOrFail($id);
        return response()->json($cultivo);
    }

    public function update(Request $request, $id)
    {
        $cultivo = Cultivo::findOrFail($id);

        $request->validate([
            'fecha_plantacion' => 'date',
            'nombre_cultivo' => 'string|max:100',
            'descripcion' => 'nullable|string',
            'fk_id_especie' => 'exists:especies,id',
            'fk_id_semillero' => 'exists:semilleros,id',
        ]);

        $cultivo->update($request->all());
        $cultivo->load('especie', 'semillero'); // Cargar relaciones
        return response()->json($cultivo);
    }

    public function destroy($id)
    {
        $cultivo = Cultivo::findOrFail($id);
        $cultivo->delete();

        return response()->json(['message' => 'Cultivo eliminado correctamente']);
    }
}