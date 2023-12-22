import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password-request',
  templateUrl: './change-password-request.component.html',
  styleUrls: ['./change-password-request.component.css']
})
export class ChangePasswordRequestComponent implements OnInit {
  resetForm: FormGroup;
  errors : any;
  successMsg : any;
  constructor(
    public fb: FormBuilder,
    public authService: AuthenticationService,
    public router : Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.resetForm.value)
    this.authService.sendResetPasswordLink(this.resetForm.value).subscribe(
      (result) => {
        this.successMsg = result;
        Swal.fire("","Un mail pour réinitialiser votre mot de passe vous a été envoyé !","success")
        this.router.navigateByUrl("/");
      },(error) => {
        this.errors = error.error.message;
        Swal.fire("Erreur !","","error");
      })
  }
}
