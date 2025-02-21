<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FlightController extends Controller
{

   

    public function store(Request $request)
    {
        $validated = $request->validate([
            'flight_name' => 'required|string|max:255',
            'launch_date' => 'required|date',
            'landing_date' => 'required|date',
            'launch_site' => 'required|string|max:255',
            'landing_site' => 'required|string|max:255',
        ]);

        $flight = Flight::create([
            'flight_name' => $request->flight_name,
            'launch_date' => $request->launch_date,
            'landing_date' => $request->landing_date,
            'launch_site' => $request->launch_site,
            'landing_site' => $request->landing_site,
        ]);

        return response()->json([
            'message' => 'Космический рейс успешно добавлен',
            'flight' => $flight
        ], 201);
    }

    public function index(Request $request)
    {
        // $user = Auth::user(); // Получаем авторизованного пользователя
        // $flights = Flight::where('user_id', $user->id)->get(); // Выбираем рейсы, доступные этому пользователю

        return response()->json($flights);
    }

    // Регистрация пользователя на рейс
    public function register(Request $request, $id)
    {
        $flight = Flight::findOrFail($id);

        // Проверяем, если количество мест на рейс превышено
        if ($flight->seats_taken >= $flight->total_seats) {
            return response()->json([
                'error' => 'Превышен лимит на запись рейса'
            ], 400);
        }

        // Увеличиваем количество занятых мест
        $flight->seats_taken += 1;
        $flight->save();

        return response()->json(['message' => 'Вы успешно записаны на рейс']);
    }
}
