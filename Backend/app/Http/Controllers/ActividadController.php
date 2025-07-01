<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActividadController extends Controller
{
    public function get(): JsonResponse
    {
        $actividades = Actividad::all();
        return response()->json(['data' => $actividades, 'message' => 'Actividades retrieved successfully'], 200);
    }

    public function post(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        $actividad = Actividad::create($validated);

        return response()->json(['data' => $actividad, 'message' => 'Actividad creada exitosamente'], 201);
    }

    public function put(Request $request, int $id_actividad): JsonResponse
    {
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        $actividad = Actividad::findOrFail($id_actividad);
        $actividad->update($validated);

        return response()->json(['data' => $actividad, 'message' => 'Actividad actualizada exitosamente'], 200);
    }

    public function patch(Request $request, int $id_actividad): JsonResponse
    {
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        $actividad = Actividad::findOrFail($id_actividad);
        $actividad->update($validated);

        return response()->json(['data' => $actividad, 'message' => 'Actividad actualizada exitosamente'], 200);
    }

    public function delete(int $id_actividad): JsonResponse
    {
        $actividad = Actividad::findOrFail($id_actividad);
        $actividad->delete();

        return response()->json(['message' => 'Actividad eliminada exitosamente'], 200);
    }
}
