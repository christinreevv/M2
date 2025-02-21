<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $fillable = [
        'mission_name',
        'launch_date',
        'launch_site_name',
        'launch_latitude',
        'launch_longitude',
        'landing_date',
        'landing_site_name',
        'landing_latitude',
        'landing_longitude',
        'spacecraft_name',
        'manufacturer',
        'crew_capacity',
        'cosmonaut_1_name',
        'cosmonaut_1_role',
        'cosmonaut_2_name',
        'cosmonaut_2_role',
        'cosmonaut_3_name',
        'cosmonaut_3_role',
    ];

}
