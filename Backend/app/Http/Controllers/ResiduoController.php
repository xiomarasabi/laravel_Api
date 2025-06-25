<?php

namespace App\Http\Controllers;

use App\Models\Residuo;
use Illuminate\Http\Request;

class ResiduoController extends Controller
{
    public function index()
    {
        $residuos = Residuo::all();
        return response()->json($residuos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string',
            'fk_id_tipo_residuo' => 'required|exists:tipo_residuos,id',
            'fk_id_cultivo' => 'required|exists:cultivos,id',
        ]);

        $residuo = Residuo::create($request->all());

        return response()->json([
            'message' => 'Residuos registrados correctamente',
            'residuo' => $residuo
        ], 201);
    }

    public function show($id)
    {
        $residuo = Residuo::findOrFail($id);
        return response()->json($residuo);
    }

    public function update(Request $request, $id)
    {
        $residuo = Residuo::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:100',
            'fecha' => 'date',
            'descripcion' => 'nullable|string',
            'fk_id_tipo_residuo' => 'exists:tipo_residuos,id',
            'fk_id_cultivo' => 'exists:cultivos,id',
        ]);

        $residuo->update($request->all());

        return response()->json($residuo);
    }

    public function destroy($id)
    {
        $residuo = Residuo::findOrFail($id);
        $residuo->delete();

        return response()->json(['message' => 'Residuo eliminado correctamente']);
    }
}