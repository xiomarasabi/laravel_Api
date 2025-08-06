<?php

namespace App\Http\Controllers;

use App\Models\Genera;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GeneraController extends Controller
{
    public function index()
    {
        // Incluye datos relacionados de lote y cultivo
        $generas = Genera::with(['venta', 'produccion'])->get();
        return response()->json($generas);
    }


     public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fk_ventas' => 'required|integer',
            'fk_produccion' => 'required|integer',
        ]);


        if ($validator->fails()) {
            return response()->json(['msg' => $validator->errors()->all()], 400);
        }

        Genera::create([
            'fk_ventas' => $request->fk_ventas,
            'fk_produccion' => $request->fk_produccion,
        ]);

        return response()->json(['message' => '✅ Cultivo registrado correctamente'], 201);
    }


}
