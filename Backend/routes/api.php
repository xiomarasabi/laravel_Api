<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HerramientaController;

Route::apiResource('herramientas', HerramientaController::class);
