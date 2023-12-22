<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Mail\WelcomeMail;
use App\Mail\WelcomeToApp;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Symfony\Component\Console\Output\ConsoleOutput;



class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register','refresh']]);
    }


    public function register(Request $request){

        $request->validate([
        'first_name'=>"required",
        'last_name'=>"required",
        'cin'=>"required",
        'genre'=>"required",
        'date_naissance'=>"required",
        'email'=>"required|email|unique:users",
        'password'=>"required|confirmed",
        'phone'=>"required",       
        'departement_id'=>"required",
        'poste'=>"required"
        ]);

        $user = new User();

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->cin = $request->cin;
        $user->date_naissance = $request->date_naissance;
        $user->email = $request->email;
        $user->genre = $request->genre;
        $user->role = $request->role? $request->role : 'user';
        $user->password = bcrypt($request->password);
        $user->phone = $request->phone;
      /*  if($request->hasFile('image')){
            $fileNameWithExt = $request->file('image')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('image')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('image')->storeAs('public/profile_images',$fileNameToStore);
            $user->image = $fileNameToStore;
         }
         else{
            $fileNameToStore = 'noimage.jpg';
         } */
        $user->verifie = false;
        $user->user_active = false;
        $user->departement_id = $request->departement_id;
        $user->poste = $request->poste;

        if ($request->hasFile('image'))
      {
            $file      = $request->file('image');
            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $picture   = time().'_'.$filename;
            //move image to public/img folder
            $file->move(public_path('img'), $picture);
            $user->image = $picture;

      } 
      else{
        $user->image = $request->genre=='Feminin'?'no-im-f-2.png': 'no-im-m.webp';
     } 
     /* else
      {
            return response()->json(["message" => "Select image first."]);
      } */

        $user->save();

        Mail::to($user->email)->send(new WelcomeMail($user));

        return response()->json([
            "status" => 1,
            "message" => "User registered successfully"
        ], 200);

    }



    public function addUser(Request $request){

        $request->validate([
        'first_name'=>"required",
        'last_name'=>"required",
        'cin'=>"required",
        'genre'=>"required",
        'date_naissance'=>"required",
        'email'=>"required|email|unique:users",
        'phone'=>"required",       
        'departement_id'=>"required",
        'poste'=>"required"
        ]);

        $user = new User();

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->cin = $request->cin;
        $user->date_naissance = $request->date_naissance;
        $user->email = $request->email;
        $user->genre = $request->genre;
        $user->role = $request->role? $request->role : 'user';
        $user->phone = $request->phone;
        $user->verifie = true;
        $user->user_active = true;
        $user->departement_id = $request->departement_id;
        $user->poste = $request->poste;
        $user->image = $request->genre=='Feminin'?'no-im-f-2.png': 'no-im-m.webp';
        $userPassword = Str::random(10);
        $user->password = bcrypt($userPassword);

        $user->save();

        Mail::to($user->email)->send(new WelcomeToApp($user,$userPassword));

        return response()->json([
            "status" => 1,
            "message" => "User added successfully"
        ], 200);

    }



    public function login(Request $request){
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('email', 'password');

        $token = Auth::attempt($credentials);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function profile(){
        $user_data = auth()->user();

        return response()->json([
            "status" => 1,
            "message" => "User profile data",
            "data" => $user_data
        ]);
    }

    public function logout(){
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

    public function update(Request $request, $id){

        if(User::where("id",$id)->exists()){
            $user = User::find($id);

            $user->first_name = !empty($request->first_name) ? $request->first_name : $user->first_name;
            $user->last_name = !empty($request->last_name) ? $request->last_name : $user->last_name;
            $user->cin = !empty($request->cin) ? $request->cin : $user->cin;
            $user->genre = !empty($request->genre) ? $request->genre : $user->genre;
            $user->email = !empty($request->email) ? $request->email : $user->email;
            $user->role = !empty($request->role) ? $request->role : $user->role;
            $user->password = !empty($request->password) ? bcrypt($request->password) : $user->password;
            $user->phone = !empty($request->phone) ? $request->phone : $user->phone;
            /*if($request->score == null){
                $output = new ConsoleOutput();
                $output->writeln('Request score vaut ::: Non nul::: '. $request->score .' aaaaaaaaaa');
                if($request->score=='0'){
                    $output = new ConsoleOutput();
                    $output->writeln('Request score vaut ::: 0 ::: '. $request->score .' aaaaaaaaaa');
                    $user->score = 0;
                }else{
                    $output = new ConsoleOutput();
                    $output->writeln('Request score vaut ::: Pas 0::: '. $request->score .' aaaaaaaaaa');
                    $user->score=$request->score;
                }
            }else{
                $output = new ConsoleOutput();
                $output->writeln('Request score vaut ::: Nul::: '. $request->score .' aaaaaaaaaa');
                $user->score = $user->score;
            }*/
            $user->score = $request->score ? $request->score : $user->score;
            $user->poste = !empty($request->poste) ? $request->poste : $user->poste;
            $user->verifie = !empty($request->verifie) ? $request->verifie : $user->verifie;
            $user->user_active = $request->user_active=='1' ? true : false;
            $user->departement_id = !empty($request->departement_id) ? $request->departement_id : $user->departement_id;
            if ($request->hasFile('image'))
            {
                  $file      = $request->file('image');
                  $filename  = $file->getClientOriginalName();
                  $extension = $file->getClientOriginalExtension();
                  $picture   = time().'_'.$filename;
                  $file->move(public_path('img'), $picture);
                  $user->image = $picture;
      
            } 
            else{
              $user->image = $user->image;
           } 
            $user->save();

            return response()->json([
                "status" => 1,
                "message" => "User updated successfully"
            ]);

        }else{
            return response()->json([
                "status" => 0,
                "message" => "User not found",
            ], 404);
        }

    }



    public function updateForScore(Request $request, $id){

        if(User::where("id",$id)->exists()){
            $user = User::find($id);

            $user->first_name = $user->first_name;
            $user->last_name = $user->last_name;
            $user->cin = $user->cin;
            $user->genre = $user->genre;
            $user->email = $user->email;
            $user->role = $user->role;
            $user->password = $user->password;
            $user->phone = $user->phone;
            if($request->score){
                if($request->score=='0'){
                    $user->score = 0;
                }else{
                    $user->score=$request->score;
                }
            }else{
                $user->score = 0;
            }
           // $user->score = $request->score ? $request->score : $user->score;
            $user->poste = $user->poste;
            $user->verifie = $user->verifie=='1' ? true : false;
            $user->user_active = $user->user_active=='1' ? true : false;
            $user->departement_id = $user->departement_id;
            $user->image = $user->image;

            $user->save();

            return response()->json([
                "status" => 1,
                "message" => "User score updated successfully"
            ]);

        }else{
            return response()->json([
                "status" => 0,
                "message" => "User not found",
            ], 404);
        }

    }


    public function updateAjout22(){
        DB::update('update users set score = score+22');
        return response()->json([
            "status" => 1,
            "message" => "Le score de 22 a été ajouté !!! "
        ]);
    }

    public function updateProfile(Request $request, $id){

        if(User::where("id",$id)->exists()){
            $user = User::find($id);

            $user->first_name = !empty($request->first_name) ? $request->first_name : $user->first_name;
            $user->last_name = !empty($request->last_name) ? $request->last_name : $user->last_name;
            $user->cin =  $request->cin;
            $user->genre = $request->genre;
            $user->email =  $request->email;
            $user->role =  $request->role;
            $user->password = !empty($request->password) ? bcrypt($request->password) : $user->password;
            $user->phone = $request->phone;
            $user->score = $request->score;
            $user->poste =  $request->poste;
            $user->verifie = $request->verifie;
            $user->user_active = $request->user_active;
            $user->departement_id = $request->departement_id;
            if ($request->hasFile('image'))
            {
                  $file      = $request->file('image');
                  $filename  = $file->getClientOriginalName();
                  $extension = $file->getClientOriginalExtension();
                  $picture   = time().'_'.$filename;
                  $file->move(public_path('img'), $picture);
                  $user->image = $picture;
            } 
            else{
              $user->image = 'noimage.jpg';
           } 
            $user->save();

            return response()->json([
                "status" => 1,
                "message" => "User updated successfully"
            ]);

        }else{
            return response()->json([
                "status" => 0,
                "message" => "User not found",
            ], 404);
        }

    }


    public function delete($id){
        if(User::where("id",$id)->exists()){
            $user = User::find($id);

            $user->delete();

            return response()->json([
                "status" => 1,
                "message" => "User deleted successfully"
            ]);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "User not found",
            ], 404);
        }
    }

    public function getUsers(){

        $users = User::where('user_active','1')->with("departement")->get();

        return response()->json([
            "status" => 1,
            "message" => "Users list",
            "data" => $users
        ], 200);

    }

    public function getUser($id){

        if(User::where("id",$id)->exists()){
            $user = User::where("id",$id)->with('departement')->first();

            return response()->json([
                "status" => 1,
                "message" => "User detail",
                "data" => $user,
               // "depart"=>$user->departement
            ], 200);
        }else{
            return response()->json([
                "status" => 0,
                "message" => "User not found",
            ], 404);
        }
    }

    public function getDesactives(){

        $users = User::where([['verifie','1'],['user_active','0']])->with("departement")->get();

        return response()->json([
            "status" => 1,
            "message" => "Users list",
            "data" => $users
        ], 200);

    }

    public function getNewUsers(){

        $users = User::where('verifie','0')->with("departement")->get();

        return response()->json([
            "status" => 1,
            "message" => "Users list",
            "data" => $users
        ], 200);

    }

    public function searchUsers(Request $request)
{
    $data = $request->get('q');
    $users = User::where([['last_name', 'like', "%{$data}%"],['user_active','1']])->orWhere([['first_name', 'like', "%{$data}%"],['user_active','1']])
             ->with("departement")
             ->get();

    return Response()->json([
        "status" => 1,
        "message" => "Users list",
        "length"=>$users->count(),
        "data" => $users
    ], 200);
}
}
