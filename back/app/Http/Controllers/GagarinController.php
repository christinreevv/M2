<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GagarinController extends Controller
{

// -------------- Получение информации о Гагарине --------------

public function getGagarinFlight() {
    $mission = Mission::with(['launchDetail', 'landingDetail', 'spacecraft', 'crewMembers.cosmonaut'])->where('name', 'Восток 1')->first();

    return response()->json([
        'data' => [
            'mission' => [
                'name' => $mission->name,
                'launch_details' => $mission->launchDetail,
                'landing' => $mission->landingDetail,
                'spacecraft' => $mission->spacecraft,
                'cosmonaut' => $mission->crewMembers->first()->cosmonaut
            ]
        ]
    ]);
}
}
