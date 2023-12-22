<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['getDeparts']]);
    }
    
    public function createDepart(Request $request){

        $request->validate([
            "depart_name"=>"required"
        ]);

        $depart = new Departement();

        $depart->depart_name = $request->depart_name;

        $depart->save();

        return response()->json([
            "status" => 1,
            "message" => "Departement saved successfully"
        ], 200);

    }

    public function getDeparts(){
        $departs = Departement::with('users')->get();

        return response()->json([
            "status" => 1,
            "message" => "Departements list",
            "data" => $departs
        ], 200);
    }

    public function getDepart($id){
        if(Departement::where("id",$id)->exists()){
            $depart = Departement::where("id",$id)->first();

            return response()->json([
                "status" => 1,
                "message" => "Departement detail",
                "data" => $depart
            ], 200);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Departement not found",
            ], 404);
        }
    }
    
    public function updateDepart(Request $request, $id){

        if(Departement::where("id",$id)->exists()){

            $depart = Departement::find($id);

            $depart->depart_name = !empty($request->depart_name) ? $request->depart_name : $depart->depart_name;

            $depart->save();

            return response()->json([
                "status" => 1,
                "message" => "Departement updated successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Departement not found",
            ], 404);
        }
    }

    public function deleteDepart($id){
        if(Departement::where("id",$id)->exists()){
            $depart = Departement::find($id);

            $depart->delete();

            return response()->json([
                "status" => 1,
                "message" => "Departement deleted successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Departement not found",
            ], 404);
        }
    }
}
