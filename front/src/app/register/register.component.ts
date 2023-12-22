import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {User} from "../model/user.model";
import {Router} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {DepartementRespo} from "../model/departement.model";
import {DepartementService} from "../services/departement.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup;
  departs!: Observable<DepartementRespo>
  errorMessage!: string;
  profileImage : File | undefined;
  constructor(private userService:UserService, private fb: FormBuilder, private router:Router, private departService : DepartementService) { }

  ngOnInit(): void {
    this.registerFormGroup =this.fb.group({
      first_name : this.fb.control(null, [Validators.required]),
      last_name : this.fb.control(null, [Validators.required]),
      cin : this.fb.control(null, [Validators.required]),
      date_naissance : this.fb.control(null, [Validators.required]),
      genre : this.fb.control(null, [Validators.required]),
      departement_id : this.fb.control(null, [Validators.required]),
      poste : this.fb.control(null, [Validators.required]),
      email : this.fb.control(null, [Validators.required, Validators.email]),
      phone : this.fb.control(null, [Validators.required]),
      password : this.fb.control(null, [Validators.required]),
      password_confirmation : this.fb.control(null, [Validators.required]),
    });
    this.handleDepartementsList();
  }


  uploadfile(event: Event) {
    this.profileImage = (event.target as HTMLInputElement)?.files?.[0];
    console.log(this.profileImage)
  }

  handleRegisterUser() {
    var myFormData = new FormData();
    myFormData.append('first_name', this.registerFormGroup.value.first_name);
    myFormData.append('last_name', this.registerFormGroup.value.last_name);
    myFormData.append('cin', this.registerFormGroup.value.cin);
    myFormData.append('genre', this.registerFormGroup.value.genre);
    myFormData.append('role', "user");
    myFormData.append('date_naissance', this.registerFormGroup.value.date_naissance);
    myFormData.append('email', this.registerFormGroup.value.email);
    myFormData.append('password', this.registerFormGroup.value.password);
    myFormData.append('password_confirmation', this.registerFormGroup.value.password_confirmation);
    myFormData.append('phone', this.registerFormGroup.value.phone);
    myFormData.append('departement_id', this.registerFormGroup.value.departement_id);
    myFormData.append('poste', this.registerFormGroup.value.poste);
    // @ts-ignore
    myFormData.append('image', this.profileImage);

    this.userService.saveUser(myFormData).subscribe({
      next : data => {
        alert("Votre compte a été créé avec succès");
        //this.newCustomerFormGroup.reset();
        this.router.navigateByUrl("/");
      },
      error : err => {
        console.log(err);
      }
    });
  }

  handleDepartementsList() {
    this.departs = this.departService.getDepartements().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }


}
