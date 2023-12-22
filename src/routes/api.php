<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CongeController;
use App\Http\Controllers\Api\DepartementController;
use App\Http\Controllers\Api\HolidaysController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\ChangePasswordController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post("register", [UserController::class, "register"]);
Route::post("add-user", [UserController::class, "addUser"]);
Route::post("login", [UserController::class, "login"]);
Route::get("profile", [UserController::class, "profile"]);
Route::post('refresh', [UserController::class, "refresh"]);
Route::post("logout", [UserController::class, "logout"]);
Route::put("update/{id}", [UserController::class, "update"]);
Route::put("update-score/{id}", [UserController::class, "updateForScore"]);
Route::post("update-profile/{id}", [UserController::class, "updateProfile"]);
Route::get("delete/{id}", [UserController::class, "delete"]);
Route::get("get-users", [UserController::class, "getUsers"]);
Route::get("get-user/{id}", [UserController::class, "getUser"]);
Route::get("desactives", [UserController::class, "getDesactives"]);
Route::get("new-users", [UserController::class, "getNewUsers"]);
Route::put("update-score", [UserController::class, "updateAjout22"]);
Route::get("search-users", [UserController::class, "searchUsers"]);


Route::post("demande-conge", [CongeController::class, "demandeConge"]);
Route::get("total-conges", [CongeController::class, "totalConges"]);
Route::get("conge-details/{id}", [CongeController::class, "congeDetails"]);
Route::get("total-conges-by-user/{id}", [CongeController::class, "totalCongesByUser"]);
Route::get("user-conges-pending/{id}", [CongeController::class, "userPendingConges"]);
Route::get("user-conges-not-pending/{id}", [CongeController::class, "userNotPendingConges"]);
Route::get("total-pending-conges", [CongeController::class, "allPendingConges"]);
Route::get("total-not-pending-conges", [CongeController::class, "allNotPendingConges"]);
Route::get("in-progress-conges", [CongeController::class, "inProgressConges"]);
Route::get("demande-annulation-conges", [CongeController::class, "demandeAnnulationConges"]);
Route::get("suggested-conges/{id}", [CongeController::class, "userSuggestedConges"]);
Route::get("archived-conges", [CongeController::class, "archivedConges"]);
Route::get("user-conges", [CongeController::class, "userConges"]);
Route::get("delete-conge/{id}", [CongeController::class, "deleteConge"]);
Route::put("update-conge/{id}", [CongeController::class, "updateConge"]);
Route::get("conge-simultanes-par-departement/{id}", [CongeController::class, "congesSimultanesParDepartement"]);
Route::get("conges-simultanes-all/{id}", [CongeController::class, "congesSimultanesTousDepartements"]);
Route::get("search-not-pending", [CongeController::class, "searchAllNotPendingConges"]);
Route::get("search-in-progress", [CongeController::class, "searchInProgressConges"]);
Route::get("search-archived", [CongeController::class, "searchArchivedConges"]);
Route::get("all-added-conges", [CongeController::class, "allAddedConges"]);
Route::get("search-added", [CongeController::class, "searchAddedConges"]);

Route::get("congrats-mail/{id}", [CongeController::class, "sendCongratsMail"]);
Route::get("not-accepted-mail/{id}", [CongeController::class, "sendNotAcceptedMail"]);


Route::post("create-depart", [DepartementController::class, "createDepart"]);
Route::get("get-departs", [DepartementController::class, "getDeparts"]);
Route::get("get-depart/{id}", [DepartementController::class, "getDepart"]);
Route::put("update-depart/{id}", [DepartementController::class, "updateDepart"]);
Route::get("delete-depart/{id}", [DepartementController::class, "deleteDepart"]);


Route::post("create-holiday", [HolidaysController::class, "create"]);
Route::get("get-holidays", [HolidaysController::class, "show"]);
Route::get("get-holidays-dates", [HolidaysController::class, "showDates"]);
Route::get("delete-holiday/{id}", [HolidaysController::class, "destroy"]);


Route::post('reset-password-request', [PasswordResetRequestController::class, 'sendPasswordResetEmail']);
 
Route::post('change-password', [ChangePasswordController::class, 'passwordResetProcess']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
 