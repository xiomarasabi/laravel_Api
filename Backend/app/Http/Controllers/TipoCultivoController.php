<?php

namespace App\Http\Controllers;

use App\Models\TipoCultivo;
use Illuminate\Http\Request;

class TipoCultivoController extends Controller
{
    public function index()
    {
        $tipoCultivos = TipoCultivo::all();
        return response()->json($tipoCultivos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        $tipoCultivo = TipoCultivo::create($request->all());

        return response()->json([
            'msg' => 'Tipo de cultivo registrado con éxito',
            'tipo_cultivo' => $tipoCultivo
        ], 201);
    }

    public function show($id)
    {
        $tipoCultivo = TipoCultivo::findOrFail($id);
        return response()->json($tipoCultivo);
    }

    public function update(Request $request, $id)
    {
        $tipoCultivo = TipoCultivo::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        $tipoCultivo->update($request->all());

        return response()->json($tipoCultivo);
    }

    public function destroy($id)
    {
        $tipoCultivo = TipoCultivo::findOrFail($id);
        $tipoCultivo->delete();

        return response()->json(['msg' => 'Tipo de cultivo eliminado correctamente']);
    }
}