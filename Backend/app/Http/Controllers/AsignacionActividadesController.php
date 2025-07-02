<?php

namespace App\Http\Controllers;

use App\Models\AsignacionActividad;
use App\Models\AsignacionActividades;
use Illuminate\Http\Request;

class AsignacionActividadesController extends Controller
{
    public function index()
    {
        // Carga las relaciones actividad y user
        $asignaciones = AsignacionActividades::with(['actividad', 'user'])->get();
        return response()->json($asignaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'fk_id_actividad' => 'required|exists:actividades,id_actividad', // Corrige el nombre de la tabla a 'actividades'
            'fk_identificacion' => 'required|exists:users,id',
        ]);

        $asignacion = AsignacionActividades::create($request->all());

        // Carga las relaciones actividad y user
        $asignacion->load(['actividad', 'user']);

        return response()->json($asignacion, 201);
    }

    public function show($id)
    {
        // Carga las relaciones actividad y user
        $asignacion = AsignacionActividades::with(['actividad', 'user'])->findOrFail($id);
        return response()->json($asignacion);
    }

    public function update(Request $request, $id)
    {
        $asignacion = AsignacionActividades::findOrFail($id);

        $request->validate([
            'fecha' => 'sometimes|date', // Usa 'sometimes' para permitir actualizaciones parciales
            'fk_id_actividad' => 'sometimes|exists:actividades,id_actividad', // Corrige el nombre de la tabla
            'fk_identificacion' => 'sometimes|exists:users,id',
        ]);

        $asignacion->update($request->all());

        // Carga las relaciones actividad y user
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
