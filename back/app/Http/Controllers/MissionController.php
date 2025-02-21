<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MissionController extends Controller
{

// -------------------------- Получение лунных миссий --------------------------

    public function lunarMissions()
    {
        // Получаем все миссии "Аполлон"
        $missions = Mission::where('mission_name', 'like', 'Аполлон%')->get();

        // Проверяем, найдены ли миссии
        if ($missions->isEmpty()) {
            return response()->json(['message' => 'Миссии не найдены'], 404);
        }

        // Формируем JSON-ответ
        $formattedMissions = $missions->map(function ($mission) {
            return [
                'mission' => [
                    'name' => $mission->mission_name,
                    'launch_details' => [
                        'launch_date' => $mission->launch_date ?? 'Неизвестно',
                        'launch_site' => [
                            'name' => $mission->launch_site ?? 'Неизвестно',
                            'location' => [
                                'latitude' => (string) ($mission->launch_latitude ?? 'Неизвестно'),
                                'longitude' => (string) ($mission->launch_longitude ?? 'Неизвестно'),
                            ],
                        ],
                    ],
                    'landing_details' => [
                        'landing_date' => $mission->landing_date ?? 'Неизвестно',
                        'landing_site' => [
                            'name' => $mission->landing_site ?? 'Неизвестно',
                            'coordinates' => [
                                'latitude' => (string) ($mission->landing_latitude ?? 'Неизвестно'),
                                'longitude' => (string) ($mission->landing_longitude ?? 'Неизвестно'),
                            ],
                        ],
                    ],
                    'spacecraft' => [
                        'command_module' => $mission->command_module ?? 'Неизвестно',
                        'lunar_module' => $mission->lunar_module ?? 'Неизвестно',
                        'crew' => $this->formatCrew($mission->crew_names, $mission->crew_roles),
                    ],
                ],
            ];
        });

        return response()->json($formattedMissions);
    }


// -------------------------- Информация о Гагарине --------------------------

    public function gagarinFlight()
    {
        $mission = Mission::where('mission_name', 'Восток 1')->first();

        if (!$mission) {
            return response()->json(['message' => 'Миссия не найдена'], 404);
        }

        return response()->json([
            'data' => [
                'mission' => [
                    'name' => $mission->mission_name,
                    'launch_details' => [
                        'launch_date' => $mission->launch_date,
                        'launch_site' => [
                            'name' => $mission->launch_site,
                            'location' => [
                                'latitude' => $mission->launch_latitude,
                                'longitude' => $mission->launch_longitude,
                            ],
                        ],
                    ],
                    'flight_duration' => [
                        'hours' => $mission->flight_duration_hours,
                        'minutes' => $mission->flight_duration_minutes,
                    ],
                    'spacecraft' => [
                        'name' => $mission->spacecraft_name,
                        'manufacturer' => $mission->spacecraft_manufacturer,
                        'crew_capacity' => $mission->crew_capacity,
                    ],
                ],
                'landing' => [
                    'date' => $mission->landing_date,
                    'site' => [
                        'name' => $mission->landing_site,
                        'coordinates' => [
                            'latitude' => $mission->landing_latitude,
                            'longitude' => $mission->landing_longitude,
                        ],
                    ],
                    'details' => [
                        'parachute_landing' => (bool) $mission->parachute_landing,
                        'impact_velocity_mps' => $mission->impact_velocity_mps,
                    ],
                ],
                'cosmonaut' => [
                    'name' => $mission->cosmonaut_name,
                    'birthdate' => $mission->cosmonaut_birthdate,
                    'rank' => $mission->cosmonaut_rank,
                    'bio' => [
                        'early_life' => $mission->cosmonaut_early_life,
                        'career' => $mission->cosmonaut_career,
                        'post_flight' => $mission->cosmonaut_post_flight,
                    ],
                ],
            ],
        ]);
    }

    // Информация о миссии Аполлон-11
    public function flight()
    {
        $mission = Mission::where('mission_name', 'Аполлон-11')->first();

        if (!$mission) {
            return response()->json(['message' => 'Миссия не найдена'], 404);
        }

        return response()->json([
            'data' => [
                'name' => $mission->mission_name,
                'crew_capacity' => $mission->crew_capacity,
                'crew' => $this->formatCrew($mission->crew_names, $mission->crew_roles),
                'launch_details' => [
                    'launch_date' => $mission->launch_date,
                    'launch_site' => [
                        'name' => $mission->launch_site,
                        'latitude' => $mission->launch_latitude,
                        'longitude' => $mission->launch_longitude,
                    ],
                ],
                'landing_details' => [
                    'landing_date' => $mission->landing_date,
                    'landing_site' => [
                        'name' => $mission->landing_site,
                        'latitude' => $mission->landing_latitude,
                        'longitude' => $mission->landing_longitude,
                    ],
                ],
            ],
        ]);
    }

// -------------------------- Получение миссии по ID 200 --------------------------

    public function show($id)
    {
        $mission = Mission::find($id);
        if (!$mission) {
            return response()->json(["error" => "Миссия не найдена"], 404);
        }
        return response()->json($mission);
    }

// -------------------------- Добавление новой миссии 201 --------------------------

public function store(Request $request)
{
    $validated = $request->validate([
        'mission.name' => 'required|string|max:255',
        'mission.launch_details.launch_date' => 'required|date',
        'mission.launch_details.launch_site.name' => 'required|string|max:255',
        'mission.launch_details.launch_site.location.latitude' => 'required|numeric',
        'mission.launch_details.launch_site.location.longitude' => 'required|numeric',
        'mission.landing_details.landing_date' => 'required|date',
        'mission.landing_details.landing_site.name' => 'required|string|max:255',
        'mission.landing_details.landing_site.coordinates.latitude' => 'required|numeric',
        'mission.landing_details.landing_site.coordinates.longitude' => 'required|numeric',
        'mission.spacecraft.command_module' => 'required|string|max:255',
        'mission.spacecraft.lunar_module' => 'required|string|max:255',
        'mission.spacecraft.crew' => 'required|array|min:1|max:3',
        'mission.spacecraft.crew.*.name' => 'required|string|max:255',
        'mission.spacecraft.crew.*.role' => 'required|string|max:255',
    ]);

    $mission = Mission::create([
        'mission_name' => $validated['mission']['name'],
        'launch_date' => $validated['mission']['launch_details']['launch_date'],
        'launch_site_name' => $validated['mission']['launch_details']['launch_site']['name'],
        'launch_latitude' => $validated['mission']['launch_details']['launch_site']['location']['latitude'],
        'launch_longitude' => $validated['mission']['launch_details']['launch_site']['location']['longitude'],
        'landing_date' => $validated['mission']['landing_details']['landing_date'],
        'landing_site_name' => $validated['mission']['landing_details']['landing_site']['name'],
        'landing_latitude' => $validated['mission']['landing_details']['landing_site']['coordinates']['latitude'],
        'landing_longitude' => $validated['mission']['landing_details']['landing_site']['coordinates']['longitude'],
        'spacecraft_name' => $validated['mission']['spacecraft']['command_module'],
        'manufacturer' => $validated['mission']['spacecraft']['lunar_module'],
        'crew_capacity' => count($validated['mission']['spacecraft']['crew']),
        'cosmonaut_1_name' => $validated['mission']['spacecraft']['crew'][0]['name'] ?? null,
        'cosmonaut_1_role' => $validated['mission']['spacecraft']['crew'][0]['role'] ?? null,
        'cosmonaut_2_name' => $validated['mission']['spacecraft']['crew'][1]['name'] ?? null,
        'cosmonaut_2_role' => $validated['mission']['spacecraft']['crew'][1]['role'] ?? null,
        'cosmonaut_3_name' => $validated['mission']['spacecraft']['crew'][2]['name'] ?? null,
        'cosmonaut_3_role' => $validated['mission']['spacecraft']['crew'][2]['role'] ?? null,
    ]);

    return response()->json(['message' => 'Mission created successfully', 'mission' => $mission], 201);
}


// -------------------------- Обновление миссии 201 --------------------------

    public function update(Request $request, $id)
    {
        // Найти миссию по ID
    $mission = Mission::find($id);

    if (!$mission) {
        return response()->json(['error' => 'Миссия не найдена'], 404);
    }

    // Валидация входных данных
    $validated = $request->validate([
        'mission.name' => 'required|string',
        'mission.launch_details.launch_date' => 'required|date',
        'mission.launch_details.launch_site.name' => 'required|string',
        'mission.launch_details.launch_site.location.latitude' => 'required|numeric',
        'mission.launch_details.launch_site.location.longitude' => 'required|numeric',
        'mission.landing_details.landing_date' => 'required|date',
        'mission.landing_details.landing_site.name' => 'required|string',
        'mission.landing_details.landing_site.coordinates.latitude' => 'required|numeric',
        'mission.landing_details.landing_site.coordinates.longitude' => 'required|numeric',
        'mission.spacecraft.command_module' => 'required|string',
        'mission.spacecraft.lunar_module' => 'required|string',
        'mission.spacecraft.crew' => 'required|array',
        'mission.spacecraft.crew.*.name' => 'required|string',
        'mission.spacecraft.crew.*.role' => 'required|string',
    ]);

    // Обновление данных миссии
    $mission->update([
        'mission_name' => $validated['mission']['name'],
        'launch_date' => $validated['mission']['launch_details']['launch_date'],
        'launch_site' => $validated['mission']['launch_details']['launch_site']['name'],
        'launch_latitude' => $validated['mission']['launch_details']['launch_site']['location']['latitude'],
        'launch_longitude' => $validated['mission']['launch_details']['launch_site']['location']['longitude'],
        'landing_date' => $validated['mission']['landing_details']['landing_date'],
        'landing_site' => $validated['mission']['landing_details']['landing_site']['name'],
        'landing_latitude' => $validated['mission']['landing_details']['landing_site']['coordinates']['latitude'],
        'landing_longitude' => $validated['mission']['landing_details']['landing_site']['coordinates']['longitude'],
        'spacecraft_name' => $validated['mission']['spacecraft']['command_module'],
        'spacecraft_manufacturer' => $validated['mission']['spacecraft']['lunar_module'],
        'crew_capacity' => count($validated['mission']['spacecraft']['crew']),
        'crew_names' => implode(',', array_column($validated['mission']['spacecraft']['crew'], 'name')),
        'crew_roles' => implode(',', array_column($validated['mission']['spacecraft']['crew'], 'role')),
    ]);

    return response()->json([
        'data' => [
            'code' => 200,
            'message' => 'Миссия обновлена'
        ]
    ]);
}


// -------------------------- Удаление 204 --------------------------

    public function destroy($id)
    {
        $mission = Mission::find($id);

        if (!$mission) {
            return response()->json(["error" => "Миссия не найдена"], 404);
        }

        $mission->delete();

        return response()->json(["message" => "Миссия удалена"]);
    }

}
