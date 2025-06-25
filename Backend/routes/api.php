<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HerramientaController;
use App\Http\Controllers\InsumoController;
use App\Http\Controllers\ProduccionController;

Route::apiResource('insumos', InsumoController::class);
Route::apiResource('herramientas', HerramientaController::class);
Route::apiResource('producciones', ProduccionController::class);
