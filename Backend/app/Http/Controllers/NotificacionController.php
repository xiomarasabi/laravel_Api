<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificacionController extends Controller
{
    public function get(): JsonResponse
    {
        $notificaciones = Notificacion::with('programacion')->get();
        return response()->json(['data' => $notificaciones, 'message' => 'Notificaciones retrieved successfully'], 200);
    }

    public function post(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'fk_id_programacion' => 'required|exists:programacion,id_programacion',
        ]);

        $notificacion = Notificacion::create($validated);

        return response()->json(['data' => $notificacion, 'message' => 'Notificación creada exitosamente'], 201);
    }

    public function put(Request $request, int $id_notificacion): JsonResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'fk_id_programacion' => 'required|exists:programacion,id_programacion',
        ]);

        $notificacion = Notificacion::findOrFail($id_notificacion);
        $notificacion->update($validated);

        return response()->json(['data' => $notificacion, 'message' => 'Notificación actualizada exitosamente'], 200);
    }

    public function patch(Request $request, int $id_notificacion): JsonResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'fk_id_programacion' => 'required|exists:programacion,id_programacion',
        ]);

        $notificacion = Notificacion::findOrFail($id_notificacion);
        $notificacion->update($validated);

        return response()->json(['data' => $notificacion, 'message' => 'Notificación actualizada exitosamente'], 200);
    }

    public function delete(int $id_notificacion): JsonResponse
    {
        $notificacion = Notificacion::findOrFail($id_notificacion);
        $notificacion->delete();

        return response()->json(['message' => 'Notificación eliminada exitosamente'], 200);
    }
}
