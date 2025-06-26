<?php

namespace App\Http\Controllers;

use App\Models\Asignacion_Actividades;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AsignacionActividadesController extends Controller
{
    public function get(): JsonResponse
    {
        $asignaciones = Asignacion_Actividades::with(['actividad', 'identificacion'])->get();
        return response()->json(['data' => $asignaciones, 'message' => 'Asignaciones retrieved successfully'], 200);
    }

    public function post(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
            'fk_identificacion' => 'required|exists:identificacion,id_identificacion', // Adjust based on Identificacion model
        ]);

        $asignacion = Asignacion_Actividades::create($validated);

        return response()->json(['data' => $asignacion, 'message' => 'Asignación creada exitosamente'], 201);
    }

    public function put(Request $request, int $id_asignacion_actividad): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
            'fk_identificacion' => 'required|exists:identificacion,id_identificacion', // Adjust based on Identificacion model
        ]);

        $asignacion = Asignacion_Actividades::findOrFail($id_asignacion_actividad);
        $asignacion->update($validated);

        return response()->json(['data' => $asignacion, 'message' => 'Asignación actualizada exitosamente'], 200);
    }

    public function patch(Request $request, int $id_asignacion_actividad): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
            'fk_identificacion' => 'required|exists:identificacion,id_identificacion', // Adjust based on Identificacion model
        ]);

        $asignacion = Asignacion_Actividades::findOrFail($id_asignacion_actividad);
        $asignacion->update($validated);

        return response()->json(['data' => $asignacion, 'message' => 'Asignación actualizada exitosamente'], 200);
    }

    public function delete(int $id_asignacion_actividad): JsonResponse
    {
        $asignacion = Asignacion_Actividades::findOrFail($id_asignacion_actividad);
        $asignacion->delete();

        return response()->json(['message' => 'Asignación eliminada exitosamente'], 200);
    }
}
