<?php

namespace App\Http\Controllers;

use App\Models\AsignacionActividades;
use Illuminate\Http\Request;

class AsignacionActividadesController extends Controller
{
    public function index()
    {
        $asignaciones = AsignacionActividades::with(['actividad', 'user'])->get();
        return response()->json($asignaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
            'fk_identificacion' => 'required|exists:usuarios,identificacion',
        ]);

        $asignacion = AsignacionActividades::create($request->all());

        $asignacion->load(['actividad', 'user']);

        return response()->json($asignacion, 201);
    }

    public function show($id)
    {
        $asignacion = AsignacionActividades::with(['actividad', 'user'])->findOrFail($id);
        return response()->json($asignacion);
    }

    public function update(Request $request, $id)
    {
        $asignacion = AsignacionActividades::findOrFail($id);

        $request->validate([
            'fecha' => 'sometimes|date',
            'fk_id_actividad' => 'sometimes|exists:actividad,id_actividad',
            'fk_identificacion' => 'sometimes|exists:usuarios,identificacion',
        ]);

        $asignacion->update($request->all());

        $asignacion->load(['actividad', 'user']);

        return response()->json($asignacion);
    }

    public function destroy($id)
    {
        $asignacion = AsignacionActividades::findOrFail($id);
        $asignacion->delete();

        return response()->json(['message' => 'Asignación de actividad eliminada correctamente'], 200);
    }
}
