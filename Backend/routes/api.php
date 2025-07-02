<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HerramientaController;
use App\Http\Controllers\InsumoController;
use App\Http\Controllers\ProduccionController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\CultivoController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\LoteController;
use App\Http\Controllers\EraController;
use App\Http\Controllers\PlantacionController;
use App\Http\Controllers\EspecieController;
use App\Http\Controllers\SemilleroController;
use App\Http\Controllers\TipoCultivoController;
use App\Http\Controllers\TipoResiduoController;
use App\Http\Controllers\ResiduoController;
use App\Http\Controllers\PeaController;
use App\Http\Controllers\DesarrollanController;
use App\Http\Controllers\ControlFitosanitarioController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AuthController;


Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::apiResource('usuario', UsuarioController::class)->only(['store']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    // Recursos protegidos
    Route::apiResource('rol', RolController::class);
    Route::apiResource('produccion', ProduccionController::class);
    Route::apiResource('ventas', VentaController::class);
    Route::apiResource('insumos', InsumoController::class);
    Route::apiResource('herramientas', HerramientaController::class);
    Route::apiResource('cultivos', CultivoController::class);
    Route::apiResource('ubicaciones', UbicacionController::class);
    Route::apiResource('lotes', LoteController::class);
    Route::apiResource('eras', EraController::class);
    Route::apiResource('plantacions', PlantacionController::class);
    Route::apiResource('especies', EspecieController::class);
    Route::apiResource('semilleros', SemilleroController::class);
    Route::apiResource('tipo_cultivos', TipoCultivoController::class);
    Route::apiResource('tipo_residuos', TipoResiduoController::class);
    Route::apiResource('residuos', ResiduoController::class);
    Route::apiResource('peas', PeaController::class);
    Route::apiResource('desarrollan', DesarrollanController::class);
    Route::apiResource('control_fitosanitario', ControlFitosanitarioController::class);
});


