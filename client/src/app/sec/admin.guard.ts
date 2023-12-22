import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  role!: string;
  constructor(private authService : AuthenticationService, private router : Router) {
  }

  canActivate() {
    this.role = this.authService.getRole();
    if(this.authService.adminAccess()){
    return true;
    } else if(this.role=="user" || this.role=="manager")  {
      this.router.navigate(["/dashboard"]);
      return false;
    } else{
      alert("You not having access")
      this.router.navigateByUrl("/");
      return false;
    }
  }

}
