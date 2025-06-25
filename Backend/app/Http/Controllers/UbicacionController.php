<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;

class UbicacionController extends Controller
{
    public function index()
    {
        $ubicaciones = Ubicacion::all();
        return response()->json($ubicaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'latitud' => 'required|numeric|between:-90,90',
            'longitud' => 'required|numeric|between:-180,180',
        ]);

        $ubicacion = Ubicacion::create($request->all());

        return response()->json([
            'msg' => 'Ubicación creada con éxito',
            'ubicacion' => $ubicacion
        ], 201);
    }

    public function show($id)
    {
        $ubicacion = Ubicacion::findOrFail($id);
        return response()->json($ubicacion);
    }

    public function update(Request $request, $id)
    {
        $ubicacion = Ubicacion::findOrFail($id);

        $request->validate([
            'latitud' => 'numeric|between:-90,90',
            'longitud' => 'numeric|between:-180,180',
        ]);

        $ubicacion->update($request->all());

        return response()->json($ubicacion);
    }

    public function destroy($id)
    {
        $ubicacion = Ubicacion::findOrFail($id);
        $ubicacion->delete();

        return response()->json(['msg' => 'Ubicación eliminada correctamente']);
    }
}