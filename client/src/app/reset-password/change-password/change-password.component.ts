import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {throwError} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  errors = null;
  constructor(
    public fb: FormBuilder,
    route: ActivatedRoute,
    public router : Router,
    public authService: AuthenticationService
  ) {
    this.changePasswordForm = this.fb.group({
        email : this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      password_confirmation: this.fb.control(null, [Validators.required]),
      passwordToken: [''],
    });
    route.queryParams.subscribe((params) => {
      this.changePasswordForm.controls['passwordToken'].setValue(
        params['token']
      );
    });
  }
  ngOnInit(): void {}
  onSubmit() {
    this.authService.resetPassword(this.changePasswordForm.value).subscribe(
      (result) => {
        Swal.fire("","Votre mot de passe a été mis à jour avec succès !","success");
        this.changePasswordForm.reset();
        this.router.navigateByUrl("/");
      },
      (error) => {
        Swal.fire("Erreur !","","error");
      }
    );
  } handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      errorMessage;
    });
  }

}
