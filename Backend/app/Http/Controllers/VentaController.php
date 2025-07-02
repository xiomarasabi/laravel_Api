<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function index()
    {
        try {
            $ventas = Venta::with('produccion')->get();
            return response()->json($ventas);
        } catch (\Exception $e) {
            Log::error('Error en index de VentaController: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener las ventas'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'fk_id_produccion' => 'required|exists:produccion,id',
                'cantidad' => 'required|numeric|min:0',
                'precio_unitario' => 'required|numeric|min:0',
                'total_venta' => 'required|numeric|min:0',
                'fecha_venta' => 'required|date',
            ]);

            $venta = Venta::create($request->all());
            $venta->load('produccion');

            return response()->json($venta, 201);
        } catch (\Exception $e) {
            Log::error('Error en store de VentaController: ' . $e->getMessage());
            return response()->json(['error' => 'Error al crear la venta'], 422);
        }
    }

    public function show($id)
    {
        try {
            $venta = Venta::with('produccion')->findOrFail($id);
            return response()->json($venta);
        } catch (\Exception $e) {
            Log::error('Error en show de VentaController: ' . $e->getMessage());
            return response()->json(['error' => 'Venta no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $venta = Venta::findOrFail($id);

            $request->validate([
                'fk_id_produccion' => 'exists:produccion,id',
                'cantidad' => 'numeric|min:0',
                'precio_unitario' => 'numeric|min:0',
                'total_venta' => 'numeric|min:0',
                'fecha_venta' => 'date',
            ]);

            $venta->update($request->all());
            $venta->load('produccion');

            return response()->json($venta);
        } catch (\Exception $e) {
            Log::error('Error en update de VentaController: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar la venta'], 422);
        }
    }

    public function destroy($id)
    {
        try {
            $venta = Venta::findOrFail($id);
            $venta->delete();

            return response()->json(['message' => 'Venta eliminada correctamente']);
        } catch (\Exception $e) {
            Log::error('Error en destroy de VentaController: ' . $e->getMessage());
            return response()->json(['error' => 'Error al eliminar la venta'], 500);
        }
    }

    // Reporte mensual
    public function getReporteVentasPorMes()
    {
        try {
            $reporteMensual = DB::table('venta')
                ->select(
                    DB::raw('EXTRACT(YEAR FROM fecha_venta) AS anio'),
                    DB::raw('EXTRACT(MONTH FROM fecha_venta) AS mes'),
                    DB::raw('SUM(total_venta) AS total_recaudado')
                )
                ->groupBy(DB::raw('EXTRACT(YEAR FROM fecha_venta)'), DB::raw('EXTRACT(MONTH FROM fecha_venta)'))
                ->orderByDesc('anio')
                ->orderByDesc('mes')
                ->get();

            if ($reporteMensual->isEmpty()) {
                return response()->json(['msg' => 'No hay datos de ventas registrados'], 404);
            }

            return response()->json(['reporteVentas' => $reporteMensual], 200);
        } catch (\Exception $e) {
            \Log::error('Error en getReporteVentasPorMes: ' . $e->getMessage());
            return response()->json(['msg' => 'Error en el servidor'], 500);
        }
    }

    // Reporte general (similar a PorProducción, si quieres diferenciarlo más deberías ajustar columnas)
    public function getReporteVentas()
    {
        try {
            $reporte = DB::table('venta as v')
                ->join('produccion as p', 'v.fk_id_produccion', '=', 'p.id')
                ->select(
                    'p.id',
                    'p.descripcion_produccion',
                    DB::raw('SUM(v.cantidad) AS total_cantidad_vendida'),
                    DB::raw('SUM(v.total_venta) AS total_recaudado')
                )
                ->groupBy('p.id', 'p.descripcion_produccion')
                ->orderByDesc('total_recaudado')
                ->get();

            if ($reporte->isEmpty()) {
                return response()->json(['msg' => 'No hay ventas registradas'], 404);
            }

            return response()->json(['reporteVentas' => $reporte], 200);
        } catch (\Exception $e) {
            \Log::error('Error en getReporteVentas: ' . $e->getMessage());
            return response()->json(['msg' => 'Error en el servidor'], 500);
        }
    }
}
