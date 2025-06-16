<?php

namespace App\Http\Controllers;

use App\Models\Insumo;
use Illuminate\Http\Request;

class InsumoController extends Controller
{
    public function index()
    {
        $insumo = Insumo::all();
        return response()->json($insumo);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'tipo' => 'required|string|max:100',
            'cantidad' => 'required|integer|min:0',
            'fecha_vencimiento' => 'required|date|after_or_equal:today',
            'precio_unidad' => 'required|numeric|min:0',
            'unidad_medida' => 'required|string|max:50',
        ]);

        $insumo = Insumo::create($request->all());
        return response()->json($insumo, 201);
    }

    public function show($id)
    {
        $insumo = Insumo::findOrFail($id);
        return response()->json($insumo);
    }

    public function update(Request $request, $id)
    {
        $insumo = Insumo::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:100',
            'tipo' => 'string|max:100',
            'cantidad' => 'integer|min:0',
            'fecha_vencimiento' => 'date|after_or_equal:today',
            'precio_unidad' => 'numeric|min:0',
            'unidad_medida' => 'string|max:50',
        ]);

        $insumo->update($request->all());
        return response()->json($insumo);
    }

    public function destroy($id)
    {
        $insumo = Insumo::findOrFail($id);
        $insumo->delete();

        return response()->json(['message' => 'Insumo eliminado correctamente']);
    }
}
