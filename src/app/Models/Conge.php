<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conge extends Model
{
    use HasFactory;

    protected $table = "conges";

    public $timestamps = false;

    protected $fillable = ["date_debut","date_fin","description","status",'demande_annulation','pas_annule','propose','ajoute',"user_id"];


    public function user()
    {
     return $this->belongsTo(User::class);
    }
}
