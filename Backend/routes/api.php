<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HerramientaController;
use App\Http\Controllers\InsumoController;

Route::apiResource('insumos', InsumoController::class);
Route::apiResource('herramientas', HerramientaController::class);
Route::apiResource('actividad', HerramientaController::class);
Route::apiResource('asignacion_actividades', HerramientaController::class);
Route::apiResource('calendario_lunar', HerramientaController::class);
Route::apiResource('notificacion', HerramientaController::class);
Route::apiResource('programacion', HerramientaController::class);
Route::apiResource('realiza', HerramientaController::class);
