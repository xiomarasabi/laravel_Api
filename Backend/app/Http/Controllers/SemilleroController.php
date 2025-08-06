<?php

namespace App\Http\Controllers;

use App\Models\Semillero;
use Illuminate\Http\Request;

class SemilleroController extends Controller
{
    public function index()
    {
        $semilleros = Semillero::all();
        return response()->json($semilleros);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_semilla' => 'required|string|max:100',
            'fecha_siembra' => 'required|date',
            'fecha_estimada' => 'required|date|after_or_equal:fecha_siembra',
            'cantidad' => 'required|integer|min:1',
        ]);

        $semillero = Semillero::create($request->all());

        return response()->json([
            'msg' => 'Semillero registrado con éxito',
            'semillero' => $semillero
        ], 201);
    }

    public function show($id)
    {
        $semillero = Semillero::findOrFail($id);
        return response()->json($semillero);
    }

    public function update(Request $request, $id)
    {
        $semillero = Semillero::findOrFail($id);

        $request->validate([
            'nombre_semilla' => 'sometimes|string|max:100',
            'fecha_siembra' => 'sometimes|date',
            'fecha_estimada' => 'sometimes|date|after_or_equal:fecha_siembra',
            'cantidad' => 'sometimes|integer|min:1',
        ]);

        $semillero->update($request->all());

        return response()->json($semillero);
    }

    public function destroy($id)
    {
        $semillero = Semillero::findOrFail($id);
        $semillero->delete();

        return response()->json(['msg' => 'Semillero eliminado correctamente'], 200);
    }

    // ✅ Función de reporte para jsPDF
    public function reporte()
    {
        $totalSemilleros = Semillero::count();
        $nombres = Semillero::pluck('nombre_semilla')->toArray();

        if ($totalSemilleros === 0 || empty($nombres)) {
            return response()->json([
                'message' => 'No se pudo generar el reporte: faltan datos.'
            ], 400);
        }

        return response()->json([
            'reporte' => [
                'total_semilleros' => $totalSemilleros,
                'nombres_semilleros' => implode(', ', $nombres),
            ]
        ]);
    }
}
