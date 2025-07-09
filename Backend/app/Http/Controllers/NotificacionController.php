<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function index()
    {
        // Carga la relación programacion
        $notificaciones = Notificacion::with('programacion')->get();
        return response()->json($notificaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'fk_id_programacion' => 'required|exists:programacion,id_programacion',
        ]);

        $notificacion = Notificacion::create($request->all());

        // Carga la relación programacion
        $notificacion->load('programacion');

        return response()->json($notificacion, 201);
    }

    public function show($id_notificacion)
    {
        // Carga la relación programacion
        $notificacion = Notificacion::with('programacion')->findOrFail($id_notificacion);
        return response()->json($notificacion);
    }

    public function update(Request $request, $id_notificacion)
    {
        $notificacion = Notificacion::findOrFail($id_notificacion);

        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'mensaje' => 'sometimes|string',
            'fk_id_programacion' => 'sometimes|exists:programacion,id_programacion',
        ]);

        $notificacion->update($request->all());

        // Carga la relación programacion
        $notificacion->load('programacion');

        return response()->json($notificacion);
    }

    public function destroy($id_notificacion)
    {
        $notificacion = Notificacion::findOrFail($id_notificacion);
        $notificacion->delete();

        return response()->json(['message' => 'Notificación eliminada correctamente'], 200);
    }
}
