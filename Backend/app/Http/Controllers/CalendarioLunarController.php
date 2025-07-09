<?php

namespace App\Http\Controllers;

use App\Models\CalendarioLunar;
use Illuminate\Http\Request;

class CalendarioLunarController extends Controller
{
    public function index()
    {
        try {
            $calendarios = CalendarioLunar::all();
            return response()->json($calendarios);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error al recuperar los eventos lunares',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'descripcion_evento' => 'required|string',
            'evento' => 'required|string|max:255',
        ]);

        $calendario = CalendarioLunar::create($request->all());

        return response()->json([
            'msg' => 'Evento lunar registrado con éxito',
            'calendario' => $calendario
        ], 201);
    }

    public function show($id)
    {
        $calendario = CalendarioLunar::findOrFail($id);
        return response()->json($calendario);
    }

    public function update(Request $request, $id)
    {
        $calendario = CalendarioLunar::findOrFail($id);

        $request->validate([
            'fecha' => 'date',
            'descripcion_evento' => 'string',
            'evento' => 'string|max:255',
        ]);

        $calendario->update($request->all());

        return response()->json($calendario);
    }

    public function destroy($id)
    {
        try {
            $calendario = CalendarioLunar::findOrFail($id);
            $calendario->delete();

            return response()->json(['msg' => 'Evento lunar eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error al eliminar el evento lunar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
