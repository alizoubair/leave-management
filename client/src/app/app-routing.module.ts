import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AdminComponent} from "./admin/admin/admin.component";
import {AdministrationComponent} from "./administration/administration.component";
import {AuthGuard} from "./sec/auth.guard";
import {AdminGuard} from "./sec/admin.guard";
import {EmployeComponent} from "./employe/employe/employe.component";
import {EmployeeGuard} from "./sec/employee.guard";
import {ChangePasswordRequestComponent} from "./reset-password/change-password-request/change-password-request.component";
import {ChangePasswordComponent} from "./reset-password/change-password/change-password.component";
import {QuitPage} from "./services/quit";

const routes: Routes = [
  { path: "register", component: RegisterComponent},
  { path: "admin/dashboard", component: AdminComponent, canActivate : [AdminGuard], canDeactivate : [QuitPage]},
  { path: "dashboard", component: EmployeComponent, canActivate : [EmployeeGuard], canDeactivate : [QuitPage]},
  { path: "reset-password", component: ChangePasswordRequestComponent},
  { path: "change-password", component: ChangePasswordComponent},
  { path: "", component: LoginComponent},
  {path:'',redirectTo:'/',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    QuitPage
  ]
})
export class AppRoutingModule { }
