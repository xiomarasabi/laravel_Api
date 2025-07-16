<?php

namespace App\Http\Controllers;

use App\Models\Mide;
use Illuminate\Http\Request;

class MideController extends Controller
{
    public function index()
    {
        $mides = Mide::with(['sensor', 'era'])->get();
        return response()->json($mides);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fk_id_sensor' => 'required|exists:sensores,id',
            'fk_id_era' => 'required|exists:eras,id',
            'valor_medicion' => 'required|numeric',
            'fecha_medicion' => 'nullable|date',
        ]);

        $mide = Mide::create([
            'fk_id_sensor' => $request->fk_id_sensor,
            'fk_id_era' => $request->fk_id_era,
            'valor_medicion' => $request->valor_medicion,
            'fecha_medicion' => $request->fecha_medicion ?? now(),
        ]);

        return response()->json([
            'msg' => 'Medición registrada con éxito',
            'mide' => $mide->load(['sensor', 'era'])
        ], 201);
    }

    public function show($id)
    {
        $mide = Mide::with(['sensor', 'era'])->findOrFail($id);
        return response()->json($mide);
    }

    public function update(Request $request, $id)
    {
        $mide = Mide::findOrFail($id);

        $request->validate([
            'fk_id_sensor' => 'exists:sensores,id',
            'fk_id_era' => 'exists:eras,id',
            'valor_medicion' => 'numeric',
            'fecha_medicion' => 'nullable|date',
        ]);

        $mide->update([
            'fk_id_sensor' => $request->fk_id_sensor ?? $mide->fk_id_sensor,
            'fk_id_era' => $request->fk_id_era ?? $mide->fk_id_era,
            'valor_medicion' => $request->valor_medicion ?? $mide->valor_medicion,
            'fecha_medicion' => $request->fecha_medicion ?? $mide->fecha_medicion,
        ]);

        return response()->json($mide->load(['sensor', 'era']));
    }

    public function destroy($id)
    {
        $mide = Mide::findOrFail($id);
        $mide->delete();

        return response()->json(['msg' => 'Medición eliminada correctamente']);
    }
}