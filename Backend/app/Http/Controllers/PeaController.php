<?php

namespace App\Http\Controllers;

use App\Models\Pea;
use Illuminate\Http\Request;

class PeaController extends Controller
{
    public function index()
    {
        $peas = Pea::all();
        return response()->json($peas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        $pea = Pea::create($request->all());

        return response()->json([
            'message' => 'Pea registrada correctamente',
            'pea' => $pea
        ], 201);
    }

    public function show($id)
    {
        $pea = Pea::findOrFail($id);
        return response()->json($pea);
    }

    public function update(Request $request, $id)
    {
        $pea = Pea::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        $pea->update($request->all());

        return response()->json($pea);
    }

    public function destroy($id)
    {
        $pea = Pea::findOrFail($id);
        $pea->delete();

        return response()->json(['message' => 'Pea eliminada correctamente']);
    }
}