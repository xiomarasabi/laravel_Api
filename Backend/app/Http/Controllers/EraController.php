<?php

namespace App\Http\Controllers;

use App\Models\Era;
use Illuminate\Http\Request;

class EraController extends Controller
{
    public function index()
    {
        $eras = Era::all();
        return response()->json($eras);
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
        $era = Era::findOrFail($id);
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