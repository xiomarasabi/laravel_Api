<?php

namespace App\Http\Controllers;

use App\Models\Herramienta;
use Illuminate\Http\Request;

class HerramientaController extends Controller
{
    public function index()
    {
        $herramientas = Herramienta::all();
        return response()->json($herramientas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:50',
            'cantidad' => 'required|integer|min:0',
            'estado' => 'required|in:Disponible,Dañada,Reparacion',
            'precio' => 'required|numeric|min:0',
        ]);

        $herramienta = Herramienta::create($request->all());
        return response()->json($herramienta, 200);
    }

    public function show(string $id)
    {
        $herramienta = Herramienta::findOrFail($id);
        return response()->json($herramienta);
    }

    public function update(Request $request, string $id)
    {
        $herramienta = Herramienta::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:50',
            'cantidad' => 'integer|min:0',
            'estado' => 'in:Disponible,Dañada,Reparacion',
            'precio' => 'numeric|min:0',
        ]);

        $herramienta->update($request->all());
        return response()->json($herramienta, 200);
    }

    public function destroy(string $id)
    {
        $herramienta = Herramienta::findOrFail($id);
        $herramienta->delete();
        return response()->json(['message' => 'Herramienta eliminada correctamente']);
    }
}
