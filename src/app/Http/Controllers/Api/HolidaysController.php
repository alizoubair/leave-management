<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidaysController extends Controller
{
   
   
    public function create(Request $request)
    {
        $request->validate([
            "holiday_date"=>"required"
        ]);

        $holiday = new Holiday();

        $holiday->holiday_date = $request->holiday_date;
        $holiday->description = $request->description;

        $holiday->save();

        return response()->json([
            "status" => 1,
            "message" => "Holiday added successfully"
        ], 200);
    }

   
    public function show()
    {
        $holidays = Holiday::get();
  
          return response()->json([
              "status" => 1,
              "message" => "Holidays list",
              "total"=>$holidays->count(),
              "data" => $holidays,
              
          ], 200);
    }

    public function showDates()
    {
        $holidays_dates = Holiday::select('holiday_date')->get();
  
          return response()->json([
              "status" => 1,
              "message" => "Holidays Dates list",
              "total"=>$holidays_dates->count(),
              "data" => $holidays_dates,
              
          ], 200);
    }

    
    public function destroy($id)
    {
        if(Holiday::where("id",$id)->exists()){
            $holiday = Holiday::find($id);

            $holiday->delete();

            return response()->json([
                "status" => 1,
                "message" => "Holiday deleted successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Holiday not found",
            ], 404);
        }
    }
}
