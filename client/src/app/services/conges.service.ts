import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User, UserRespo} from "../model/user.model";
import {environment} from "../../environments/environment";
import {Conge, CongeRespo, SingleCongeRespo} from "../model/conge.model";
import {Holiday, HolidayRespo} from "../model/holiday.model";

@Injectable({
  providedIn: 'root'
})
export class CongesService {


  constructor(private http : HttpClient) { }

  public getConges():Observable<CongeRespo>{
    return this.http.get<CongeRespo>(environment.backendHost+"/total-conges");
  }

  public getConge(conge : Conge):Observable<SingleCongeRespo>{
    return this.http.get<SingleCongeRespo>(environment.backendHost+"/conge-details/"+conge.id);
  }

  public getUserConges(id : number):Observable<CongeRespo>{
    return this.http.get<CongeRespo>(environment.backendHost+"/total-conges-by-user/"+id);
  }

  public getUserCongesPending(id : number):Observable<CongeRespo>{
    return this.http.get<CongeRespo>(environment.backendHost+"/user-conges-pending/"+id);
  }

  public getUserCongesNotPending(id : number):Observable<CongeRespo>{
    return this.http.get<CongeRespo>(environment.backendHost+"/user-conges-not-pending/"+id);
  }

  public demandeConge(conge : Conge):Observable<Conge>{
    return this.http.post<Conge>(environment.backendHost+"/demande-conge",conge);
  }
  public demandeConge2(conge : any):Observable<Conge>{
    return this.http.post<Conge>(environment.backendHost+"/demande-conge",conge);
  }

  public updateConge(conge : Conge, data : any):Observable<Conge>{
    return this.http.put<Conge>(environment.backendHost+"/update-conge/"+conge.id,data);
  }

  public deleteConge(conge : Conge):Observable<Conge>{
    return this.http.get<Conge>(environment.backendHost+"/delete-conge/"+conge.id);
  }

  public nbrejourNoWeekens(startDate : Date, endDate : Date){

    var elapsed;
    var daysBeforeFirstSaturday, daysAfterLastSunday,daysBeforeFirstSunday;
    var ifThen = function (a: any, b:any, c:any) {
      return a == b ? c : a;
    };

    elapsed = endDate.getTime() - startDate.getTime();
    elapsed /= 86400000;

    daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
    daysAfterLastSunday = endDate.getDay();

    elapsed -= (daysBeforeFirstSunday + daysAfterLastSunday);
    elapsed = (elapsed / 7) * 5;
    elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);

    return Math.ceil(elapsed);
  }

  public nbrejourConges(startDate : Date, endDate : Date, holidays: Holiday[]) {
    var diff = endDate.getTime() - startDate.getTime();
   // var holidays = new Array("2022-08-01", "2022-08-03", "2013-06-28");
    var idx_holidays = 0;
    var num_holidays = 0;
    while (idx_holidays < holidays.length) {
      let holiday:Date = new Date(holidays[idx_holidays]['holiday_date']);
     //console.log("Start date: "+startDate.getTime())
      //console.log("holiday date: "+holiday.getTime())
     // console.log("holiday : "+holiday)
     // console.log("End date: "+endDate.getTime())

      if (holiday.getTime()>=startDate.getTime() && holiday.getTime()<= endDate.getTime() && holiday.getDay()!=0 && holiday.getDay()!=6){
        num_holidays++;
       // console.log("num holidays: "+num_holidays)
      }
      idx_holidays++;
     // console.log("IDX holidays: "+idx_holidays)
    }
//holiday.getTime()>=startDate.getTime() && holiday.getTime()<= endDate.getTime() ou diff > holiday.getTime() - startDate.getTime()
    return this.nbrejourNoWeekens(startDate,endDate) - num_holidays;
  }

  getAllCongesPending():Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/total-pending-conges");
  }

  getAllCongesNotPending():Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/total-not-pending-conges");
  }
  searchCongesNotPending(text : string):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/search-not-pending?q="+text);
  }

  getInProgressConges():Observable<CongeRespo>  {
    return this.http.get<CongeRespo>(environment.backendHost+"/in-progress-conges");
  }
  searchInProgressConges(text : string):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/search-in-progress?q="+text);
  }

  getDemandeAnnulationConges():Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/demande-annulation-conges");
  }

  getSuggestedConges(id : number):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/suggested-conges/"+id);
  }

  getAllAddedConges():Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/all-added-conges");
  }
  searchAddedConges(text : string):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/search-added?q="+text);
  }

  getArchivedConges():Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/archived-conges/");
  }
  searchArchivedConges(text : string):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/search-archived?q="+text);
  }


  public getHolidays():Observable<HolidayRespo>{
    return this.http.get<HolidayRespo>(environment.backendHost+"/get-holidays");
  }

  public deleteHoliday(id : number):Observable<Holiday>{
    return this.http.get<Holiday>(environment.backendHost+"/delete-holiday/"+id);
  }

  public addHoliday(holiday : Holiday):Observable<Holiday>{
    return this.http.post<Holiday>(environment.backendHost+"/create-holiday",holiday);
  }

  getCongesInSameTimeSameDepart(id : number):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/conge-simultanes-par-departement/"+id);
  }

  getCongesInSameTimeAllDeparts(id : number):Observable<CongeRespo> {
    return this.http.get<CongeRespo>(environment.backendHost+"/conges-simultanes-all/"+id);
  }

  congratsMail(id : number):Observable<any> {
    return this.http.get<any>(environment.backendHost+"/congrats-mail/"+id);
  }

  notAcceptedMail(id : number):Observable<any> {
    return this.http.get<any>(environment.backendHost+"/not-accepted-mail/"+id);
  }


}
