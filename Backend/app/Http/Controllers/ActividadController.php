<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Http\Request;

class ActividadController extends Controller
{
    public function index()
    {
        $actividades = Actividad::all();
        return response()->json($actividades);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        $actividad = Actividad::create($request->all());

        return response()->json([
            'msg' => 'Actividad registrada con éxito',
            'actividad' => $actividad
        ], 201);
    }

    public function show($id)
    {
        $actividad = Actividad::findOrFail($id);
        return response()->json($actividad);
    }

    public function update(Request $request, $id)
    {
        $actividad = Actividad::findOrFail($id);

        $request->validate([
            'nombre_actividad' => 'string|max:255',
            'descripcion' => 'string',
        ]);

        $actividad->update($request->all());

        return response()->json($actividad);
    }

    public function destroy($id)
    {
        $actividad = Actividad::findOrFail($id);
        $actividad->delete();

        return response()->json(['msg' => 'Actividad eliminada correctamente']);
    }
}
