import { Injectable, Injector } from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class TokerInterceptorService implements HttpInterceptor{
  refresh = false;
  constructor(private inject : Injector, private http : HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let authService = this.inject.get(AuthenticationService);
    let authreq = req;
    authreq = this.addTokenHeader(req,authService.getToken())
    return next.handle(authreq).pipe(
      catchError(errorData =>{
        if(errorData.status===401 && !this.refresh){

          return this.http.post('http://localhost:8000/api/refresh', {} ).pipe(
            switchMap((res: any) => {
              //this.addTokenHeader(req, res.authorisation.token)
              let refToken = res.authorisation.token
              //console.log("ReeeeefToken : ",refToken )
              localStorage.setItem("token", refToken)
              return next.handle(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${refToken}`
                }
              }));
            })
          );
          //console.log
          //authService.logoutUser();
          //this.handleRefreshToken(req, next);
         /* this.http.post('http://localhost:8000/api/refresh', {} ).subscribe({
            next : (resp:any) =>{
              localStorage.setItem("token", resp.authorisation.token)
              Swal.fire("","Refresh token", "success")
            },
            error : err => {
              Swal.fire("","No refresh token", "warning")
            }
          }) */

        }

        this.refresh = false;
        return throwError(errorData);
      })
    )
   /* let jwtToken = req.clone({
      setHeaders : {
        Authorization : 'bearer '+ authService.getToken()
      }
    });
    return next.handle(jwtToken);*/
  }

  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler){

  }

  addTokenHeader(req: HttpRequest<any>, token: any){
    return req.clone({headers:req.headers.set('Authorization','bearer '+token)});
  }
}
