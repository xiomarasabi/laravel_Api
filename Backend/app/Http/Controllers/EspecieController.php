<?php

namespace App\Http\Controllers;

use App\Models\Especie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EspecieController extends Controller
{
    // Obtener todas las especies con su tipo de cultivo relacionado
    public function index()
    {
        $especies = Especie::with('tipoCultivo')->get();
        return response()->json($especies);
    }

    // Registrar nueva especie
    public function store(Request $request)
    {
        $request->validate([
            'nombre_comun' => 'required|string|max:100',
            'nombre_cientifico' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'fk_id_tipo_cultivo' => 'required_without:id_tipo_cultivo|exists:tipo_cultivos,id',
            'id_tipo_cultivo' => 'required_without:fk_id_tipo_cultivo|exists:tipo_cultivos,id',
        ]);

        $tipoCultivo = $request->fk_id_tipo_cultivo ?? $request->id_tipo_cultivo;

        $especie = Especie::create([
            'nombre_comun' => $request->nombre_comun,
            'nombre_cientifico' => $request->nombre_cientifico,
            'descripcion' => $request->descripcion,
            'fk_id_tipo_cultivo' => $tipoCultivo,
        ]);

        $especie->load('tipoCultivo');

        return response()->json([
            'msg' => 'Especie registrada con éxito',
            'especie' => $especie
        ], 201);
    }

    // Obtener una especie por ID con su tipo de cultivo
    public function show($id)
    {
        $especie = Especie::with('tipoCultivo')->findOrFail($id);
        return response()->json($especie);
    }

    // Actualizar especie existente
    public function update(Request $request, $id)
    {
        $especie = Especie::findOrFail($id);

        $request->validate([
            'nombre_comun' => 'string|max:100',
            'nombre_cientifico' => 'string|max:100',
            'descripcion' => 'nullable|string',
            'fk_id_tipo_cultivo' => 'required_without:id_tipo_cultivo|exists:tipo_cultivos,id',
            'id_tipo_cultivo' => 'required_without:fk_id_tipo_cultivo|exists:tipo_cultivos,id',
        ]);

        $tipoCultivo = $request->fk_id_tipo_cultivo ?? $request->id_tipo_cultivo;

        $especie->update([
            'nombre_comun' => $request->nombre_comun ?? $especie->nombre_comun,
            'nombre_cientifico' => $request->nombre_cientifico ?? $especie->nombre_cientifico,
            'descripcion' => $request->descripcion ?? $especie->descripcion,
            'fk_id_tipo_cultivo' => $tipoCultivo ?? $especie->fk_id_tipo_cultivo,
        ]);

        $especie->load('tipoCultivo');

        return response()->json($especie);
    }

    // Eliminar especie
    public function destroy($id)
    {
        $especie = Especie::findOrFail($id);
        $especie->delete();

        return response()->json(['msg' => 'Especie eliminada correctamente']);
    }

    // Reporte agrupado por tipo de cultivo
    public function reporte()
    {
        $reporte = DB::table('especies as e')
            ->join('tipo_cultivos as t', 'e.fk_id_tipo_cultivo', '=', 't.id')
            ->select(
                't.id as id_tipo_cultivo',
                't.nombre as tipo_cultivo',
                DB::raw('COUNT(e.id_especie) as total_especies')
            )
            ->groupBy('t.id', 't.nombre')
            ->get();

        return response()->json([
            'reporte' => $reporte
        ]);
    }
}
