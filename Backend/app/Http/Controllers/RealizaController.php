<?php

namespace App\Http\Controllers;

use App\Models\Realiza;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RealizaController extends Controller
{
    public function get(): JsonResponse
    {
        $realiza = Realiza::with(['cultivo', 'actividad'])->get();
        return response()->json(['data' => $realiza, 'message' => 'Realizaciones retrieved successfully'], 200);
    }

    public function post(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fk_id_cultivo' => 'required|exists:cultivo,id_cultivo',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
        ]);

        $realiza = Realiza::create($validated);

        return response()->json(['data' => $realiza, 'message' => 'Realización creada exitosamente'], 201);
    }

    public function put(Request $request, int $id_realiza): JsonResponse
    {
        $validated = $request->validate([
            'fk_id_cultivo' => 'required|exists:cultivo,id_cultivo',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
        ]);

        $realiza = Realiza::findOrFail($id_realiza);
        $realiza->update($validated);

        return response()->json(['data' => $realiza, 'message' => 'Realización actualizada exitosamente'], 200);
    }

    public function patch(Request $request, int $id_realiza): JsonResponse
    {
        $validated = $request->validate([
            'fk_id_cultivo' => 'required|exists:cultivo,id_cultivo',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
        ]);

        $realiza = Realiza::findOrFail($id_realiza);
        $realiza->update($validated);

        return response()->json(['data' => $realiza, 'message' => 'Realización actualizada exitosamente'], 200);
    }

    public function delete(int $id_realiza): JsonResponse
    {
        $realiza = Realiza::findOrFail($id_realiza);
        $realiza->delete();

        return response()->json(['message' => 'Realización eliminada exitosamente'], 200);
    }
}
