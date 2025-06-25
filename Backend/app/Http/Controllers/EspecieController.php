<?php

namespace App\Http\Controllers;

use App\Models\Especie;
use Illuminate\Http\Request;

class EspecieController extends Controller
{
    public function index()
    {
        $especies = Especie::all();
        return response()->json($especies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_comun' => 'required|string|max:100',
            'nombre_cientifico' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'fk_id_tipo_cultivo' => 'required_without:id_tipo_cultivo|exists:tipo_cultivos,id',
            'id_tipo_cultivo' => 'required_without:fk_id_tipo_cultivo|exists:tipo_cultivos,id',
        ]);

        // Prioriza fk_id_tipo_cultivo, pero usa id_tipo_cultivo si no está presente
        $tipoCultivo = $request->fk_id_tipo_cultivo ?? $request->id_tipo_cultivo;

        $especie = Especie::create([
            'nombre_comun' => $request->nombre_comun,
            'nombre_cientifico' => $request->nombre_cientifico,
            'descripcion' => $request->descripcion,
            'fk_id_tipo_cultivo' => $tipoCultivo,
        ]);

        return response()->json([
            'msg' => 'Especie registrada con éxito',
            'especie' => $especie
        ], 201);
    }

    public function show($id)
    {
        $especie = Especie::findOrFail($id);
        return response()->json($especie);
    }

    public function update(Request $request, $id)
    {
        $especie = Especie::findOrFail($id);

        $request->validate([
            'nombre_comun' => 'string|max:100',
            'nombre_cientifico' => 'string|max:100',
            'descripcion' => 'nullable|string',
            'fk_id_tipo_cultivo' => 'required_without:id_tipo_cultivo|exists:tipo_cultivos,id',
            'id_tipo_cultivo' => 'required_without:fk_id_tipo_cultivo|exists:tipo_cultivos,id',
        ]);

        // Prioriza fk_id_tipo_cultivo, pero usa id_tipo_cultivo si no está presente
        $tipoCultivo = $request->fk_id_tipo_cultivo ?? $request->id_tipo_cultivo;

        $especie->update([
            'nombre_comun' => $request->nombre_comun ?? $especie->nombre_comun,
            'nombre_cientifico' => $request->nombre_cientifico ?? $especie->nombre_cientifico,
            'descripcion' => $request->descripcion ?? $especie->descripcion,
            'fk_id_tipo_cultivo' => $tipoCultivo ?? $especie->fk_id_tipo_cultivo,
        ]);

        return response()->json($especie);
    }

    public function destroy($id)
    {
        $especie = Especie::findOrFail($id);
        $especie->delete();

        return response()->json(['msg' => 'Especie eliminada correctamente']);
    }
}