<?php

namespace App\Http\Controllers;

use App\Models\TipoResiduo;
use Illuminate\Http\Request;

class TipoResiduoController extends Controller
{
    public function index()
    {
        $tipoResiduos = TipoResiduo::all();
        return response()->json($tipoResiduos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_residuo' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        $tipoResiduo = TipoResiduo::create($request->all());

        return response()->json([
            'message' => 'Tipo de residuo registrado correctamente',
            'tipo_residuo' => $tipoResiduo
        ], 201);
    }

    public function show($id)
    {
        $tipoResiduo = TipoResiduo::findOrFail($id);
        return response()->json($tipoResiduo);
    }

    public function update(Request $request, $id)
    {
        $tipoResiduo = TipoResiduo::findOrFail($id);

        $request->validate([
            'nombre_residuo' => 'string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        $tipoResiduo->update($request->all());

        return response()->json($tipoResiduo);
    }

    public function destroy($id)
    {
        $tipoResiduo = TipoResiduo::findOrFail($id);
        $tipoResiduo->delete();

        return response()->json(['message' => 'Tipo de residuo eliminado correctamente']);
    }
}