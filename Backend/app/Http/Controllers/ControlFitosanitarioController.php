<?php

namespace App\Http\Controllers;

use App\Models\ControlFitosanitario;
use Illuminate\Http\Request;

class ControlFitosanitarioController extends Controller
{
    public function index()
    {
        $controlFitosanitarios = ControlFitosanitario::with('desarrollan.cultivo', 'desarrollan.pea')->get();
        return response()->json($controlFitosanitarios);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha_control' => 'required|date',
            'descripcion' => 'required|string',
            'fk_id_desarrollan' => 'required|exists:desarrollan,id',
            'detalle' => 'nullable|string', // Añadido para consistencia
        ]);

        $controlFitosanitario = ControlFitosanitario::create($request->all());
        $controlFitosanitario->load('desarrollan.cultivo', 'desarrollan.pea');

        return response()->json([
            'message' => 'Control fitosanitario registrado correctamente',
            'control_fitosanitario' => $controlFitosanitario
        ], 201);
    }

    public function show($id)
    {
        $controlFitosanitario = ControlFitosanitario::with('desarrollan.cultivo', 'desarrollan.pea')->findOrFail($id);
        return response()->json($controlFitosanitario);
    }

    public function update(Request $request, $id)
    {
        $controlFitosanitario = ControlFitosanitario::findOrFail($id);

        $request->validate([
            'fecha_control' => 'date',
            'descripcion' => 'string',
            'fk_id_desarrollan' => 'exists:desarrollan,id',
            'detalle' => 'nullable|string',
        ]);

        $controlFitosanitario->update($request->all());
        $controlFitosanitario->load('desarrollan.cultivo', 'desarrollan.pea');

        return response()->json($controlFitosanitario);
    }

    public function destroy($id)
    {
        $controlFitosanitario = ControlFitosanitario::findOrFail($id);
        $controlFitosanitario->delete();

        return response()->json(['message' => 'Control fitosanitario eliminado correctamente']);
    }
}