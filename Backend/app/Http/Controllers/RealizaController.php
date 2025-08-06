<?php

namespace App\Http\Controllers;

use App\Models\Realiza;
use Illuminate\Http\Request;

class RealizaController extends Controller
{
    public function index()
    {
        // Carga las relaciones cultivo y actividad
        $realiza = Realiza::with(['cultivo', 'actividad'])->get();
        return response()->json($realiza);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fk_id_cultivo' => 'required|exists:cultivo,id',
            'fk_id_actividad' => 'required|exists:actividad,id_actividad',
        ]);

        $realiza = Realiza::create($request->all());

        // Carga las relaciones cultivo y actividad
        $realiza->load(['cultivo', 'actividad']);

        return response()->json($realiza, 201);
    }

    public function show($id_realiza)
    {
        // Carga las relaciones cultivo y actividad
        $realiza = Realiza::with(['cultivo', 'actividad'])->findOrFail($id_realiza);
        return response()->json($realiza);
    }

    public function update(Request $request, $id_realiza)
    {
        $realiza = Realiza::findOrFail($id_realiza);

        $request->validate([
            'fk_id_cultivo' => 'sometimes|exists:cultivo,id',
            'fk_id_actividad' => 'sometimes|exists:actividad,id_actividad',
        ]);

        $realiza->update($request->all());

        // Carga las relaciones cultivo y actividad
        $realiza->load(['cultivo', 'actividad']);

        return response()->json($realiza);
    }

    public function destroy($id_realiza)
    {
        $realiza = Realiza::findOrFail($id_realiza);
        $realiza->delete();

        return response()->json(['message' => 'Relación eliminada correctamente'], 200);
    }
}
