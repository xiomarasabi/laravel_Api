<?php

namespace App\Http\Controllers;

use App\Models\Programacion;
use Illuminate\Http\Request;

class ProgramacionController extends Controller
{
    public function index()
    {
        // Carga las relaciones asignacionActividad y calendarioLunar
        $programaciones = Programacion::with(['asignacionActividad', 'calendarioLunar'])->get();
        return response()->json($programaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,completado,cancelado',
            'fecha_programada' => 'required|date',
            'duracion' => 'required|date_format:H:i:s',
            'fk_id_asignacion_actividad' => 'required|exists:asignacion_actividades,id_asignacion_actividad',
            'fk_id_calendario_lunar' => 'required|exists:calendario_lunar,id_calendario_lunar',
        ]);

        $programacion = Programacion::create($request->all());

        // Carga las relaciones asignacionActividad y calendarioLunar
        $programacion->load(['asignacionActividad', 'calendarioLunar']);

        return response()->json($programacion, 201);
    }

    public function show($id_programacion)
    {
        // Carga las relaciones asignacionActividad y calendarioLunar
        $programacion = Programacion::with(['asignacionActividad', 'calendarioLunar'])->findOrFail($id_programacion);
        return response()->json($programacion);
    }

    public function update(Request $request, $id_programacion)
    {
        $programacion = Programacion::findOrFail($id_programacion);

        $request->validate([
            'estado' => 'sometimes|in:pendiente,completado,cancelado',
            'fecha_programada' => 'sometimes|date',
            'duracion' => 'sometimes|date_format:H:i:s',
            'fk_id_asignacion_actividad' => 'sometimes|exists:asignacion_actividades,id_asignacion_actividad',
            'fk_id_calendario_lunar' => 'sometimes|exists:calendario_lunar,id_calendario_lunar',
        ]);

        $programacion->update($request->all());

        // Carga las relaciones asignacionActividad y calendarioLunar
        $programacion->load(['asignacionActividad', 'calendarioLunar']);

        return response()->json($programacion);
    }

    public function destroy($id_programacion)
    {
        $programacion = Programacion::findOrFail($id_programacion);
        $programacion->delete();

        return response()->json(['message' => 'Programación eliminada correctamente'], 200);
    }
}
