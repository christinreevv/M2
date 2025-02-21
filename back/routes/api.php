<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\GagarinController;
use App\Http\Controllers\MissionController;

// Route::post('/flights', [FlightController::class, 'store']);
// Route::get('/flights', [FlightController::class, 'index']);
// Route::post('/flights/{id}/register', [FlightController::class, 'register']);

// --------------------------------- FRONT ---------------------------------

Route::get('/lunar-missions/{id}', [MissionController::class, 'show']);
Route::get('/search', [MissionController::class, 'search']);

// --------------------------------- GET (BACK) ---------------------------------

Route::get('/gagarin-flight', [MissionController::class, 'gagarinFlight']); //1. 200
Route::get('/flight', [MissionController::class, 'flight']); //2. 200
Route::get('/lunar-missions', [MissionController::class, 'lunarMissions']); //3. 200

// --------------------------------- BACK & FRONT ---------------------------------

Route::post('/lunar-missions', [MissionController::class, 'store']); // Добавление новой миссии 201
Route::delete('/lunar-missions/{id}', [MissionController::class, 'destroy']); // Удаление миссии 200
Route::patch('/lunar-missions/{id}', [MissionController::class, 'update']); // Обновление миссии 200



