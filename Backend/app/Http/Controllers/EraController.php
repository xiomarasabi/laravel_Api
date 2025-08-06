<?php

namespace App\Http\Controllers;

use App\Models\Era;
use Illuminate\Http\Request;

class EraController extends Controller
{
    public function index()
{
    try {
        $eras = Era::select('eras.id', 'eras.descripcion', 'eras.estado', 'lotes.nombre_lote as nombre')
            ->leftJoin('lotes', 'eras.fk_id_lote', '=', 'lotes.id')
            ->get();
        return response()->json($eras);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al obtener las eras: ' . $e->getMessage()], 500);
    }
}

    public function store(Request $request)
    {
        $request->validate([
            'descripcion' => 'nullable|string',
            'fk_id_lote' => 'required|exists:lotes,id',
            'estado' => 'in:Activo,Inactivo',
        ]);

        $era = Era::create([
            'descripcion' => $request->descripcion,
            'fk_id_lote' => $request->fk_id_lote,
            'estado' => $request->estado ?? 'Activo',
        ]);

        return response()->json([
            'msg' => 'Era registrada con éxito',
            'era' => $era
        ], 201);
    }

    public function show($id)
    {
        $era = Era::select('eras.id', 'eras.descripcion', 'eras.estado', 'lotes.nombre_lote as lote_nombre')
            ->leftJoin('lotes', 'eras.fk_id_lote', '=', 'lotes.id')
            ->where('eras.id', $id)
            ->firstOrFail();
        return response()->json($era);
    }

    public function update(Request $request, $id)
    {
        $era = Era::findOrFail($id);

        $request->validate([
            'descripcion' => 'nullable|string',
            'fk_id_lote' => 'exists:lotes,id',
            'estado' => 'in:Activo,Inactivo',
        ]);

        $era->update([
            'descripcion' => $request->descripcion ?? $era->descripcion,
            'fk_id_lote' => $request->fk_id_lote ?? $era->fk_id_lote,
            'estado' => $request->estado ?? $era->estado,
        ]);

        return response()->json($era);
    }

    public function destroy($id)
    {
        $era = Era::findOrFail($id);
        $era->delete();

        return response()->json(['msg' => 'Era eliminada correctamente']);
    }
}