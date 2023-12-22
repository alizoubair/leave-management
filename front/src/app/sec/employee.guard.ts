import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {
  constructor(private authService : AuthenticationService, private router : Router) {
  }
  canActivate() {
    if(this.authService.employeeAccess()){
      return true;
    } else {
      this.router.navigateByUrl("/");
      return false;
    }
  }


}
