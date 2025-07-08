<?php

namespace App\Http\Controllers;

use App\Models\Produccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProduccionController extends Controller
{
    public function index()
    {
        // Incluye datos relacionados de lote y cultivo
        $producciones = Produccion::with(['lote', 'cultivo'])->get();
        return response()->json($producciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cantidad_producida' => 'required|numeric|min:0',
            'nombre_produccion' => 'required|string|max:50',
            'fecha_produccion' => 'required|date',
            'fk_id_lote' => 'required|exists:lote,id',
            'fk_id_cultivo' => 'required|exists:cultivo,id',
            'descripcion_produccion' => 'nullable|string',
            'estado' => 'required|string|max:20',
            'fecha_cosecha' => 'nullable|date|after_or_equal:fecha_produccion',
        ]);

        $produccion = Produccion::create($request->all());

        // Carga relaciones después de crear
        $produccion->load(['lote', 'cultivo']);

        return response()->json($produccion, 201);
    }

    public function show($id)
    {
        $produccion = Produccion::with(['lote', 'cultivo'])->findOrFail($id);
        return response()->json($produccion);
    }

    public function update(Request $request, $id)
    {
        $produccion = Produccion::findOrFail($id);

        $request->validate([
            'cantidad_producida' => 'numeric|min:0',
            'nombre_produccion' => 'string|max:50',
            'fecha_produccion' => 'date',
            'fk_id_lote' => 'exists:lote,id',
            'fk_id_cultivo' => 'exists:cultivo,id',
            'descripcion_produccion' => 'nullable|string',
            'estado' => 'string|max:20',
            'fecha_cosecha' => 'nullable|date|after_or_equal:fecha_produccion',
        ]);

        $produccion->update($request->all());

        // Carga relaciones actualizadas
        $produccion->load(['lote', 'cultivo']);

        return response()->json($produccion);
    }

    public function destroy($id)
    {
        $produccion = Produccion::findOrFail($id);
        $produccion->delete();

        return response()->json(['message' => 'Producción eliminada correctamente']);
    }

    public function getReporteProduccion()
    {
        try {
            $producciones = DB::table('produccion as p')
                ->join('lotes as l', 'p.fk_id_lote', '=', 'l.id')
                ->select(
                    'p.fk_id_lote',
                    'l.nombre_lote',
                    DB::raw('COALESCE(SUM(p.cantidad_producida), 0) as total_producido')
                )
                ->groupBy('p.fk_id_lote', 'l.nombre_lote')
                ->orderBy('l.nombre_lote')
                ->get();

            if ($producciones->isEmpty()) {
                return response()->json(['msg' => 'No hay producciones registradas'], 404);
            }

            $resultado = $producciones->map(function ($p) {
                return [
                    'fk_id_lote' => [
                        'id' => $p->fk_id_lote,
                        'nombre_lote' => $p->nombre_lote,
                    ],
                    'cantidad_producida' => (float) $p->total_producido,
                ];
            });

            return response()->json(['producciones' => $resultado], 200);
        } catch (\Exception $e) {
            \Log::error('Error en getReporteProduccion: ' . $e->getMessage());
            return response()->json(['msg' => 'Error en el servidor'], 500);
        }
    }
}
