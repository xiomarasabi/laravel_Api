<?php

namespace App\Http\Controllers;

use App\Models\Lote;
use Illuminate\Http\Request;

class LoteController extends Controller
{
    public function index()
    {
        $lotes = Lote::all();
        return response()->json($lotes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'dimension' => 'required|numeric|min:0.01',
            'nombre_lote' => 'required|string|max:100',
            'fk_id_ubicacion' => 'required|exists:ubicaciones,id_ubicacion',
            'estado' => 'required|in:Activo,Inactivo',
        ]);

        $lote = Lote::create($request->all());

        return response()->json([
            'msg' => 'Lote registrado con éxito',
            'lote' => $lote
        ], 201);
    }

    public function show($id)
    {
        $lote = Lote::findOrFail($id);
        return response()->json($lote);
    }

    public function update(Request $request, $id)
    {
        $lote = Lote::findOrFail($id);

        $request->validate([
            'dimension' => 'numeric|min:0.01',
            'nombre_lote' => 'string|max:100',
            'fk_id_ubicacion' => 'exists:ubicaciones,id_ubicacion',
            'estado' => 'in:Activo,Inactivo',
        ]);

        $lote->update([
            'dimension' => $request->dimension ?? $lote->dimension,
            'nombre_lote' => $request->nombre_lote ?? $lote->nombre_lote,
            'fk_id_ubicacion' => $request->fk_id_ubicacion ?? $lote->fk_id_ubicacion,
            'estado' => $request->estado ?? $lote->estado,
        ]);

        return response()->json($lote);
    }

    public function destroy($id)
    {
        $lote = Lote::findOrFail($id);
        $lote->delete();

        return response()->json(['msg' => 'Lote eliminado correctamente']);
    }
}