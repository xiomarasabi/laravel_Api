<?php

namespace App\Http\Controllers;

use App\Models\Programacion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramacionController extends Controller
{
    public function get(): JsonResponse
    {
        $programaciones = Programacion::with(['asignacionActividades', 'calendarioLunar'])->get();
        return response()->json(['data' => $programaciones, 'message' => 'Programaciones retrieved successfully'], 200);
    }

    public function post(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'estado' => 'required|string|max:50',
            'fecha_programada' => 'required|date',
            'duracion' => 'required|integer',
            'fk_id_asignacion_actividad' => 'required|exists:asignacion__actividades,id_asignacion_actividad',
            'fk_id_calendario_lunar' => 'required|exists:calendario_lunar,id_calendario_lunar',
        ]);

        $programacion = Programacion::create($validated);

        return response()->json(['data' => $programacion, 'message' => 'Programación creada exitosamente'], 201);
    }

    public function put(Request $request, int $id_programacion): JsonResponse
    {
        $validated = $request->validate([
            'estado' => 'required|string|max:50',
            'fecha_programada' => 'required|date',
            'duracion' => 'required|integer',
            'fk_id_asignacion_actividad' => 'required|exists:asignacion__actividades,id_asignacion_actividad',
            'fk_id_calendario_lunar' => 'required|exists:calendario_lunar,id_calendario_lunar',
        ]);

        $programacion = Programacion::findOrFail($id_programacion);
        $programacion->update($validated);

        return response()->json(['data' => $programacion, 'message' => 'Programación actualizada exitosamente'], 200);
    }

    public function patch(Request $request, int $id_programacion): JsonResponse
    {
        $validated = $request->validate([
            'estado' => 'required|string|max:50',
            'fecha_programada' => 'required|date',
            'duracion' => 'required|integer',
            'fk_id_asignacion_actividad' => 'required|exists:asignacion__actividades,id_asignacion_actividad',
            'fk_id_calendario_lunar' => 'required|exists:calendario_lunar,id_calendario_lunar',
        ]);

        $programacion = Programacion::findOrFail($id_programacion);
        $programacion->update($validated);

        return response()->json(['data' => $programacion, 'message' => 'Programación actualizada exitosamente'], 200);
    }

    public function delete(int $id_programacion): JsonResponse
    {
        $programacion = Programacion::findOrFail($id_programacion);
        $programacion->delete();

        return response()->json(['message' => 'Programación eliminada exitosamente'], 200);
    }
}
