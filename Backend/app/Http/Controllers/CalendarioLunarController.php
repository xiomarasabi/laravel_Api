<?php

namespace App\Http\Controllers;

use App\Models\CalendarioLunar;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CalendarioLunarController extends Controller
{
    public function get(): JsonResponse
    {
        $calendarios = CalendarioLunar::all();
        return response()->json(['data' => $calendarios, 'message' => 'Eventos lunares retrieved successfully'], 200);
    }

    public function post(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'descripcion_evento' => 'required|string',
            'evento' => 'required|string|max:255',
        ]);

        $calendario = CalendarioLunar::create($validated);

        return response()->json(['data' => $calendario, 'message' => 'Evento lunar creado exitosamente'], 201);
    }

    public function put(Request $request, int $id_calendario_lunar): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'descripcion_evento' => 'required|string',
            'evento' => 'required|string|max:255',
        ]);

        $calendario = CalendarioLunar::findOrFail($id_calendario_lunar);
        $calendario->update($validated);

        return response()->json(['data' => $calendario, 'message' => 'Evento lunar actualizado exitosamente'], 200);
    }

    public function patch(Request $request, int $id_calendario_lunar): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'descripcion_evento' => 'required|string',
            'evento' => 'required|string|max:255',
        ]);

        $calendario = CalendarioLunar::findOrFail($id_calendario_lunar);
        $calendario->update($validated);

        return response()->json(['data' => $calendario, 'message' => 'Evento lunar actualizado exitosamente'], 200);
    }

    public function delete(int $id_calendario_lunar): JsonResponse
    {
        $calendario = CalendarioLunar::findOrFail($id_calendario_lunar);
        $calendario->delete();

        return response()->json(['message' => 'Evento lunar eliminado exitosamente'], 200);
    }
}
