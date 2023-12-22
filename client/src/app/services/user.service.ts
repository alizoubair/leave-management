import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {SingleUserRespo, User, UserRespo} from "../model/user.model";
import {Conge} from "../model/conge.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  public getUsers():Observable<UserRespo>{
    return this.http.get<UserRespo>(environment.backendHost+"/get-users");
  }

  public searchUsers(text : string):Observable<UserRespo>{
    return this.http.get<UserRespo>(environment.backendHost+"/search-users?q="+text);
  }

  public getUser(id : number):Observable<SingleUserRespo>{
    return this.http.get<SingleUserRespo>(environment.backendHost+"/get-user/"+id);
  }

  public getDesactives():Observable<UserRespo>{
    return this.http.get<UserRespo>(environment.backendHost+"/desactives");
  }

  public getNewUsers():Observable<UserRespo>{
    return this.http.get<UserRespo>(environment.backendHost+"/new-users");
  }

  public profile(user : User):Observable<SingleUserRespo>{
    return this.http.get<SingleUserRespo>(environment.backendHost+"/get-user/"+user.id);
  }

  public saveUser(myFormData : FormData):Observable<User>{
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<User>(environment.backendHost+"/register",myFormData);
  }

  public addUser(user : any):Observable<User>{
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<User>(environment.backendHost+"/add-user",user);
  }

  public updateUser(user : User, data : any):Observable<User>{
    return this.http.put<User>(environment.backendHost+"/update/"+user.id,data);
  }
  public updateUserScore(user : User, data : any):Observable<User>{
    return this.http.put<User>(environment.backendHost+"/update-score/"+user.id,data);
  }

  public updateUserProfile(user : User, data : any):Observable<User>{
    return this.http.post<User>(environment.backendHost+"/update-profile/"+user.id,data);
  }

  public deleteUser(user : User):Observable<User>{
    return this.http.get<User>(environment.backendHost+"/delete/"+user.id);
  }

  public addUsersToLocalCache(usersRespo: UserRespo): void {
    localStorage.setItem('usersRespo', JSON.stringify(usersRespo));
  }

  public getUsersFromLocalCache() {
    if (localStorage.getItem('usersRespo')) {
      return JSON.parse(<string>localStorage.getItem('usersRespo'));
    }
    return null;
  }

}
