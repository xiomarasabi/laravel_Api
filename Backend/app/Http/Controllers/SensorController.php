<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function index()
    {
        $sensores = Sensor::all();
        return response()->json($sensores);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_sensor' => 'required|string',
            'tipo_sensor' => 'required|string',
            'unidad_medida' => 'required|string',
            'descripcion' => 'nullable|string',
            'medida_minima' => 'required|numeric',
            'medida_maxima' => 'required|numeric',
        ]);

        $sensor = Sensor::create([
            'nombre_sensor' => $request->nombre_sensor,
            'tipo_sensor' => $request->tipo_sensor,
            'unidad_medida' => $request->unidad_medida,
            'descripcion' => $request->descripcion,
            'medida_minima' => $request->medida_minima,
            'medida_maxima' => $request->medida_maxima,
        ]);

        return response()->json([
            'msg' => 'Sensor registrado con éxito',
            'sensor' => $sensor
        ], 201);
    }

    public function show($id)
    {
        $sensor = Sensor::findOrFail($id);
        return response()->json($sensor);
    }

    public function update(Request $request, $id)
    {
        $sensor = Sensor::findOrFail($id);

        $request->validate([
            'nombre_sensor' => 'string',
            'tipo_sensor' => 'string',
            'unidad_medida' => 'string',
            'descripcion' => 'nullable|string',
            'medida_minima' => 'numeric',
            'medida_maxima' => 'numeric',
        ]);

        $sensor->update([
            'nombre_sensor' => $request->nombre_sensor ?? $sensor->nombre_sensor,
            'tipo_sensor' => $request->tipo_sensor ?? $sensor->tipo_sensor,
            'unidad_medida' => $request->unidad_medida ?? $sensor->unidad_medida,
            'descripcion' => $request->descripcion ?? $sensor->descripcion,
            'medida_minima' => $request->medida_minima ?? $sensor->medida_minima,
            'medida_maxima' => $request->medida_maxima ?? $sensor->medida_maxima,
        ]);

        return response()->json($sensor);
    }

    public function destroy($id)
    {
        $sensor = Sensor::findOrFail($id);
        $sensor->delete();

        return response()->json(['msg' => 'Sensor eliminado correctamente']);
    }
}