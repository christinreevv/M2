<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    // ------------------- Регистрация пользователя -------------------
    public function register(Request $request)
    {



        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'regex:/^[A-ЯЁ][а-яё]*$/u'],
            'last_name' => ['required', 'string', 'regex:/^[A-ЯЁ][а-яё]*$/u'],
            'patronymic' => ['required', 'string', 'regex:/^[A-ЯЁ][а-яё]*$/u'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                'min:6',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
            'birth_date' => ['required', 'date_format:Y-m-d', 'before:today'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 422,
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Создание пользователя
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'patronymic' => $request->patronymic,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birth_date' => $request->birth_date,
            'api_token' => Str::random(80),
        ]);

        return response()->json([
            'data' => [
                'user' => [
                    'name' => "{$user->last_name} {$user->first_name} {$user->patronymic}",
                    'email' => $user->email,
                ],
                'token' => $user->api_token,  // Отправляем API-токен
                'code' => 201,
                'message' => 'Пользователь успешно создан',
            ],
        ], 201);
    }

    // ------------------- Аутентификация пользователя -------------------

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => [
                    'code' => 422,
                    'message' => 'Ошибка валидации',
                    'errors' => $validator->errors(),
                ]
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Неверный логин или пароль',
                'code' => 401,
            ], 401);
        }

        // Генерация нового токена
        $user->api_token = Str::random(80);
        $user->save();

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => "{$user->last_name} {$user->first_name} {$user->patronymic}",
                    'birth_date' => $user->birth_date,
                    'email' => $user->email,
                ],
                'token' => $user->api_token,
            ],
        ], 200);
    }

    // ------------------- Выход пользователя (logout) -------------------
    public function logout(Request $request)
    {
        $user = User::where('api_token', $request->bearerToken())->first();

        if ($user) {
            $user->api_token = null;  // Обнуляем токен
            $user->save();
            return response()->json([
                "message" => 'Вы успешно вышли из системы',
                "code" => 200
            ]);
        }

        return response()->json([
            "message" => "Неверный токен",
            "code" => 401
        ], 401);
    }
}
