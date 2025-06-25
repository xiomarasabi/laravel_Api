<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function index()
    {
        // Incluye información de la producción relacionada
        $ventas = Venta::with('produccion')->get();
        return response()->json($ventas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fk_id_produccion' => 'required|exists:produccion,id',
            'cantidad' => 'required|numeric|min:0',
            'precio_unitario' => 'required|numeric|min:0',
            'total_venta' => 'required|numeric|min:0',
            'fecha_venta' => 'required|date',
        ]);

        $venta = Venta::create($request->all());

        // Carga la relación produccion
        $venta->load('produccion');

        return response()->json($venta, 201);
    }

    public function show($id)
    {
        $venta = Venta::with('produccion')->findOrFail($id);
        return response()->json($venta);
    }

    public function update(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);

        $request->validate([
            'fk_id_produccion' => 'exists:produccion,id',
            'cantidad' => 'numeric|min:0',
            'precio_unitario' => 'numeric|min:0',
            'total_venta' => 'numeric|min:0',
            'fecha_venta' => 'date',
        ]);

        $venta->update($request->all());

        $venta->load('produccion');

        return response()->json($venta);
    }

    public function destroy($id)
    {
        $venta = Venta::findOrFail($id);
        $venta->delete();

        return response()->json(['message' => 'Venta eliminada correctamente']);
    }
}
