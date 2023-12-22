import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {UserRespo} from "../model/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  dropDownList!: number;
  users! : Observable<UserRespo>;
  errorMessage! : string;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

}
