<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HerramientaController;
use App\Http\Controllers\InsumoController;
use App\Http\Controllers\ProduccionController;
use App\Http\Controllers\VentaController;

Route::apiResource('insumos', InsumoController::class);
Route::apiResource('herramientas', HerramientaController::class);
Route::apiResource('produccion', ProduccionController::class);
Route::apiResource('ventas', VentaController::class);
