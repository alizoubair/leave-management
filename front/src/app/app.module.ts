import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin/admin.component';
import { EmployeComponent } from './employe/employe/employe.component';
import { ManagerComponent } from './manager/manager/manager.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdministrationComponent } from './administration/administration.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TokerInterceptorService} from "./services/toker-interceptor.service";
import {NgxPaginationModule} from "ngx-pagination";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ChangePasswordRequestComponent } from './reset-password/change-password-request/change-password-request.component';
import { ChangePasswordComponent } from './reset-password/change-password/change-password.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    EmployeComponent,
    ManagerComponent,
    RegisterComponent,
    LoginComponent,
    AdministrationComponent,
    ChangePasswordRequestComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({positionClass : "toast-top-center", timeOut : 3000, progressBar : true}),

  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:TokerInterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
