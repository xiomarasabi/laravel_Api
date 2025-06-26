<?php

namespace App\Http\Controllers;

use App\Models\Plantacion;
use Illuminate\Http\Request;

class PlantacionController extends Controller
{
    public function index()
    {
        $plantaciones = Plantacion::all();
        return response()->json($plantaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fk_id_cultivo' => 'required|exists:cultivos,id',
            'fk_id_era' => 'required|exists:eras,id',
        ]);

        $plantacion = Plantacion::create($request->all());

        return response()->json([
            'message' => 'Plantación registrada correctamente',
            'plantacion' => $plantacion
        ], 201);
    }

    public function show($id)
    {
        $plantacion = Plantacion::findOrFail($id);
        return response()->json($plantacion);
    }

    public function update(Request $request, $id)
    {
        $plantacion = Plantacion::findOrFail($id);

        $request->validate([
            'fk_id_cultivo' => 'exists:cultivos,id',
            'fk_id_era' => 'exists:eras,id',
        ]);

        $plantacion->update($request->all());

        return response()->json($plantacion);
    }

    public function destroy($id)
    {
        $plantacion = Plantacion::findOrFail($id);
        $plantacion->delete();

        return response()->json(['message' => 'Plantación eliminada correctamente']);
    }
}