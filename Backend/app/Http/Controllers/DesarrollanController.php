<?php

namespace App\Http\Controllers;

use App\Models\Desarrollan;
use Illuminate\Http\Request;

class DesarrollanController extends Controller
{
    public function index()
    {
        $desarrollan = Desarrollan::all();
        return response()->json($desarrollan);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fk_id_cultivo' => 'required|exists:cultivos,id',
            'fk_id_pea' => 'required|exists:peas,id',
        ]);

        $desarrollan = Desarrollan::create($request->all());

        return response()->json([
            'message' => 'Registro en desarrollan creado correctamente',
            'desarrollan' => $desarrollan
        ], 201);
    }

    public function show($id)
    {
        $desarrollan = Desarrollan::findOrFail($id);
        return response()->json($desarrollan);
    }

    public function update(Request $request, $id)
    {
        $desarrollan = Desarrollan::findOrFail($id);

        $request->validate([
            'fk_id_cultivo' => 'exists:cultivos,id',
            'fk_id_pea' => 'exists:peas,id',
        ]);

        $desarrollan->update($request->all());

        return response()->json($desarrollan);
    }

    public function destroy($id)
    {
        $desarrollan = Desarrollan::findOrFail($id);
        $desarrollan->delete();

        return response()->json(['message' => 'Registro en desarrollan eliminado correctamente']);
    }
}