import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Conge, CongeRespo, SingleCongeRespo} from "../model/conge.model";
import {environment} from "../../environments/environment";
import {Departement, DepartementRespo, SingleDepartementRespo} from "../model/departement.model";

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  constructor(private http : HttpClient) { }

  public getDepartements():Observable<DepartementRespo>{
    return this.http.get<DepartementRespo>(environment.backendHost+"/get-departs");
  }

  public getDepartement(depart : Departement):Observable<SingleDepartementRespo>{
    return this.http.get<SingleDepartementRespo>(environment.backendHost+"/get-depart/"+depart.id);
  }

  public createDepartement(depart : Departement):Observable<Departement>{
    return this.http.post<Departement>(environment.backendHost+"/create-depart",depart);
  }

  public updateDepartement(depart : Departement, data : any):Observable<Departement>{
    return this.http.put<Departement>(environment.backendHost+"/update-depart/"+depart.id,data);
  }

  public deleteDepartement(depart : Departement):Observable<Departement>{
    return this.http.get<Departement>(environment.backendHost+"/delete-depart/"+depart.id);
  }
}
