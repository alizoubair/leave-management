import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http : HttpClient, private router : Router) { }

  public loginUser(user:any){
    return this.http.post(environment.backendHost+"/login",user);
  }

  public logoutUser(){
    alert("Your session expired")
    localStorage.clear();
    this.router.navigate([""]);
    return this.http.post(environment.backendHost+"/logout",null);
  }

  isLoggedIn(){
    return localStorage.getItem('token')!=null;
  }

  getToken(){
    return localStorage.getItem('token') || "";
  }

  adminAccess(){
    var logginToken = localStorage.getItem('token') || "";
    var _extractedToken = logginToken.split('.')[1];
    var _atobdata = atob(_extractedToken);
    var _finaldata = JSON.parse(_atobdata);

    console.log(_finaldata)

    if(_finaldata.role=='admin'){
      return true;
    } else {
      return false;
    }
  }

  employeeAccess(){
    var logginToken = localStorage.getItem('token') || "";
    var _extractedToken = logginToken.split('.')[1];
    var _atobdata = atob(_extractedToken);
    var _finaldata = JSON.parse(_atobdata);

    console.log(_finaldata)

    if(_finaldata.role=='user' || _finaldata.role=='manager' ){
      return true;
    } else {
      alert("You not having access")
      return false;
    }
  }

  getRole() {
    var logginToken = localStorage.getItem('token') || "";
    var _extractedToken = logginToken.split('.')[1];
    var _atobdata = atob(_extractedToken);
    var _finaldata = JSON.parse(_atobdata);
    return _finaldata.role;
  }


  getLoggedUser() {
    var logginToken = localStorage.getItem('token') || "";
    var _extractedToken = logginToken.split('.')[1];
    var _atobdata = atob(_extractedToken);
    var _finaldata = JSON.parse(_atobdata);
    return _finaldata;
  }

  sendResetPasswordLink(data : any) {
    return this.http.post(environment.backendHost+'/reset-password-request', data)
  }

  resetPassword(data : any) {
    return this.http.post(environment.backendHost+'/change-password', data)
  }
}
