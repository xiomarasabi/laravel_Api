<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HerramientaController;
use App\Http\Controllers\InsumoController;

Route::apiResource('insumos', InsumoController::class);
Route::apiResource('herramientas', HerramientaController::class);
