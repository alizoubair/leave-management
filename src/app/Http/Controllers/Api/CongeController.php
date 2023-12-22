<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conge;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Output\ConsoleOutput;
use App\Mail\CongratsMail;
use App\Mail\NotAcceptedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;


class CongeController extends Controller
{

 /*   public function __construct()
    {
        $this->middleware('auth:api');
    } */
    
    public function demandeConge(Request $request){

        $request->validate([
            "date_debut"=>"required",
            "date_fin"=>"required",
            "user_id"=>"required"
        ]);

        $conge = new Conge();

        $conge->date_debut = $request->date_debut;
        $conge->date_fin = $request->date_fin;
        $conge->description = $request->description;
        $conge->propose = $request->propose=='1' ? true : false;
        $conge->ajoute = $request->ajoute=='1' ? true : false;
        $conge->user_id = $request->user_id;
        $conge->status = $request->status ? $request->status : 'Pending';
        $conge->save();

        return response()->json([
            "status" => 1,
            "message" => "Conge added successfully"
        ], 200);

    }


    public function congeDetails($id){
        if(Conge::where("id",$id)->exists()){
            $conge = Conge::where("id",$id)->with('user.departement')->first();

            return response()->json([
                "status" => 1,
                "message" => "Conge detail",
                "data" => $conge,
                //"depart"=>$conge->user->departement
            ], 200);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Conge not found",
            ], 404);
        }
    }



    public function totalConges(){
        $conges = Conge::with('user.departement')->get();

      /*  $conges2 = [];
        for($i=0;$i<$conges->count();$i=$i+1){
            $conges2 = $this.congeDetails($conges[$i]->id);
        } */

        return response()->json([
            "status" => 1,
            "message" => "Conges list",
            "total"=>$conges->count(),
            "data" => $conges,
            
        ], 200);
    }


    public function totalCongesByUser($id){
        if(Conge::where("user_id",$id)->exists()){
            $conges = Conge::where("user_id",$id)->get();

            return response()->json([
                "status" => 1,
                "message" => "Conges list",
                "data" => $conges
            ], 200);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Conge not found for this user",
            ], 404);
        }
    }


    public function userPendingConges($id){  //$id ---> logged user id
            $conges = Conge::where("user_id",$id)->where([["status","Pending"],['date_debut','>=',Carbon::today()],["propose","=","0"]])->with("user.departement")->orderBy('id','desc')->get();

            return response()->json([
                "status" => 1,
                "message" => "Conges list",
                "data" => $conges
            ], 200);
        }
    



    public function allPendingConges(){  
            $conges = Conge::with('user.departement')->where([["status","Pending"],['date_debut','>=',Carbon::today()]])->orderBy('id','desc')->get();

            return response()->json([
                "status" => 1,
                "message" => "Conge detail",
                "data" => $conges
            ], 200);
       
    }

    public function userNotPendingConges($id){  //$id ---> logged user id
            $conges = Conge::where("user_id",$id)->where("status","!=","Pending")->with("user.departement")->orderBy('id','desc')->get();

            return response()->json([
                "status" => 1,
                "message" => "Conge detail",
                "data" => $conges
            ], 200);
        
    }


    public function userSuggestedConges($id){  //$id ---> logged user id
            $conges = Conge::where("user_id",$id)->where([["status","=","Pending"],["propose","1"]])->with("user.departement")->orderBy('id','desc')->get();

            return response()->json([
                "status" => 1,
                "message" => "Liste des congés suggerés",
                "data" => $conges
            ], 200);
      
    }

    public function congesSimultanesParDepartement($id){  //$id ---> logged user id
        $conge = Conge::where("id",$id)->first();
        $use_id = $conge->user_id;

        $user = User::where("id",$use_id)->first();
        $depart_id = $user->departement_id;

        $output = new ConsoleOutput();
        $output->writeln('my text that appears in command line '. $depart_id .' aaaaaaaaaa');
       // $conges = Conge::with("user.departement")->where([["date_debut","<",$conge->date_fin],["date_fin",">",$conge->date_debut],["conge->user.departement->id","=",$conge.user.departement->id]])->get();

        $conges = Conge::with('user.departement')
        ->where([["date_debut","<",$conge->date_fin],["date_fin",">",$conge->date_debut]])
        ->whereIn('user_id', static function($query) use($depart_id){
          $query->select(['id'])
              ->from('users')
              ->where('departement_id' ,'=',$depart_id);
        })
        ->get();
        

        return response()->json([
            "status" => 1,
            "message" => "Liste des congés",
            "total"=>$conges->count(),
            "data" => $conges
        ], 200);
  
}

public function congesSimultanesTousDepartements($id){  //$id ---> logged user id
    $conge = Conge::where("id",$id)->first();
    $conges = Conge::where([["date_debut","<",$conge->date_fin],["date_fin",">",$conge->date_debut]])->with("user.departement")->get();

    return response()->json([
        "status" => 1,
        "message" => "Liste de congés",
        "total"=>$conges->count(),
        "data" => $conges
    ], 200);

}


    public function allNotPendingConges(){ 
            $conges = Conge::with('user.departement')->where([["status","!=","Pending"],['date_debut','>=',Carbon::today()]])->orderBy('id','desc')->get();

            return response()->json([
                "status" => 1,
                "message" => "Conges list",
                "data" => $conges
            ], 200);
    }


    public function searchAllNotPendingConges(Request $request){ 
        $data = $request->get('q');
        $conges = Conge::with('user.departement')
        ->where([["status","!=","Pending"],['date_debut','>=',Carbon::today()]])
        ->whereIn('user_id', static function($query) use($data){
          $query->select(['id'])
              ->from('users')
              ->where('last_name' ,'like',"%{$data}%")
              ->orWhere('first_name' ,'like',"%{$data}%");
        })
        ->orderBy('id','desc')
        ->get();

        return response()->json([
            "status" => 1,
            "message" => "Conges list",
            "data" => $conges 
        ], 200);
}

public function allAddedConges(){ 
    $conges = Conge::with('user.departement')->where([["ajoute","=","1"]])->orderBy('id','desc')->get();

    return response()->json([
        "status" => 1,
        "message" => "Conges list",
        "data" => $conges
    ], 200);
}

public function searchAddedConges(Request $request){ 
    $data = $request->get('q');
    $conges = Conge::with('user.departement')
    ->where([["ajoute","=","1"]])
    ->whereIn('user_id', static function($query) use($data){
      $query->select(['id'])
          ->from('users')
          ->where('last_name' ,'like',"%{$data}%")
          ->orWhere('first_name' ,'like',"%{$data}%");
    })
    ->orderBy('id','desc')
    ->get();

    return response()->json([
        "status" => 1,
        "message" => "Conges list",
        "data" => $conges
    ], 200);
}


    public function inProgressConges(){ 
        $conges = Conge::with('user.departement')->where([['date_debut','<=',Carbon::today()],['date_fin','>=',Carbon::today()],['status','=','Accordé']])->orderBy('id','desc')->get();

        return response()->json([
            "status" => 1,
            "message" => "Conge detail",
            "data" => $conges
        ], 200);
}


public function searchInProgressConges(Request $request){ 
    $data = $request->get('q');
    $conges = Conge::with('user.departement')
    ->where([['date_debut','<=',Carbon::today()],['date_fin','>=',Carbon::today()],['status','=','Accordé']])
    ->whereIn('user_id', static function($query) use($data){
      $query->select(['id'])
          ->from('users')
          ->where('last_name' ,'like',"%{$data}%")
          ->orWhere('first_name' ,'like',"%{$data}%");
    })
    ->orderBy('id','desc')
    ->get();

    return response()->json([
        "status" => 1,
        "message" => "Conges list",
        "data" => $conges
    ], 200);
}

  public function archivedConges(){ 
        $conges = Conge::with('user.departement')->where([['date_debut','<',Carbon::today()],['date_fin','<',Carbon::today()]])->orderBy('id','desc')->get();

        return response()->json([
            "status" => 1,
            "message" => "Conge detail",
            "data" => $conges
        ], 200);
}

public function searchArchivedConges(Request $request){ 
    $data = $request->get('q');
    $conges = Conge::with('user.departement')
    ->where([['date_fin','<=',Carbon::today()]])
    ->whereIn('user_id', static function($query) use($data){
      $query->select(['id'])
          ->from('users')
          ->where('last_name' ,'like',"%{$data}%")
          ->orWhere('first_name' ,'like',"%{$data}%");
    })
    ->orderBy('id','desc')
    ->get();

    return response()->json([
        "status" => 1,
        "message" => "Conges list",
        "data" => $conges
    ], 200);
}


public function demandeAnnulationConges(){ 
    $conges = Conge::with('user.departement')->where([['demande_annulation','=','1'],['date_debut','>=',Carbon::today()]])->orderBy('id','desc')->get();

    return response()->json([
        "status" => 1,
        "message" => "Conge detail",
        "data" => $conges
    ], 200);
}
  
    public function userConges(){
        
    }

    public function deleteConge($id){
        if(Conge::where("id",$id)->exists()){
            $conge = Conge::find($id);

            $conge->delete();

            return response()->json([
                "status" => 1,
                "message" => "Conge deleted successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Conge not found",
            ], 404);
        }
    }




    public function updateConge(Request $request, $id){
        if(Conge::where("id",$id)->exists()){
            $conge = Conge::find($id);

            $conge->date_debut = !empty($request->date_debut) ? $request->date_debut : $conge->date_debut;
            $conge->date_fin = !empty($request->date_fin) ? $request->date_fin : $conge->date_fin;
            $conge->description = !empty($request->description) ? $request->description : $conge->description;
            $conge->demande_annulation = $request->demande_annulation=='1' ? true : false;
            $conge->pas_annule = $request->pas_annule=='1' ? true : false;
            $conge->propose = $request->propose=='1' ? true : false;
            $conge->status = !empty($request->status) ? $request->status : $conge->status;
            $conge->user_id = !empty($request->user_id) ? $request->user_id : $conge->user_id;
 
            $conge->save();

            return response()->json([
                "status" => 1,
                "message" => "Conge updated successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Conge not found",
            ], 404);
        }
    }


    public function sendCongratsMail($id){
        if(Conge::where("id",$id)->exists()){
            $conge = Conge::where("id",$id)->with('user')->first();

            Mail::to($conge->user->email)->send(new CongratsMail($conge));


            return response()->json([
                "status" => 1,
                "message" => "Mail sent successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Conge not found",
            ], 404);
        }
    }


    public function sendNotAcceptedMail($id){
        if(Conge::where("id",$id)->exists()){
            $conge = Conge::where("id",$id)->with('user')->first();

            Mail::to($conge->user->email)->send(new NotAcceptedMail($conge));


            return response()->json([
                "status" => 1,
                "message" => "Mail sent successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "Conge not found",
            ], 404);
        }
    }
}
