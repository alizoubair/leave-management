import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  responsedata : any;
  constructor(private userService:UserService, private fb: FormBuilder, private router:Router, private autService: AuthenticationService, private toastr : ToastrService) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.loginFormGroup =this.fb.group({
      email : this.fb.control(null),
      password : this.fb.control(null)});
  }

  handleLogin() {
    this.autService.loginUser(this.loginFormGroup.value).subscribe(res=>{
      if(res!=null){
        this.responsedata = res;
        console.log("Loginnnn : "+ res);
        //console.log(this.responsedata.authorisation.token)
        localStorage.setItem("token",this.responsedata.authorisation.token);
        this.toastr.success("Vous etes connectés ")
        this.router.navigate(["/admin/dashboard"])
      }
    }, error => {
      console.log("Ya erreur")
        this.toastr.error("Email ou Mot de passe incorrect","",{

        })

      }
      )
  }


}
