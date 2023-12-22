import { Component, OnInit } from '@angular/core';
import {async, catchError, map, Observable, of, Subscription, throwError} from "rxjs";
import {User, UserRespo} from "../../model/user.model";
import {UserService} from "../../services/user.service";
import {Departement, DepartementRespo} from "../../model/departement.model";
import {DepartementService} from "../../services/departement.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import Swal from "sweetalert2";
import {environment} from "../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users! : Observable<UserRespo>;
  desactives! : Observable<UserRespo>;
  newUsers! : Observable<UserRespo>;
  departements! : Observable<DepartementRespo>;
  errorMessage! : string;
  dropDownList!: number;
  isList!: number;
  isMenu: boolean = false;
  desactiv: boolean = true;
  departementDetails!: Departement;
  isMenuBtn() {
    this.isMenu = !this.isMenu;
  }
  isSearch: boolean = false;
  affichAdmin!: number;
  departFormGroup!: FormGroup;
  addUserFormGroup!: FormGroup;
  userDetails! : User;
  userDetailsRedirect! : number
  userUpdateRedirect! : number
  updateUserFormGroup!: FormGroup;
  detailsUserFormGroup!: FormGroup;
  updateDepartFormGroup!: FormGroup;
  detailsDepartFormGroup!: FormGroup;
  loggedUser : any;
  companyName : string =environment.companyName;
  p4!: number;
  profileImageAdress : String = environment.profilePicHost;
  searchFormGroup!: FormGroup;
  subscriptions: Subscription[] = [];




  constructor(private usersService:UserService, private departService : DepartementService, private fb: FormBuilder, private router : Router, private authService : AuthenticationService) { }

  ngOnInit(): void {
    this.addUserFormGroup =this.fb.group({
      first_name : this.fb.control(null),
      last_name : this.fb.control(null),
      cin : this.fb.control(null),
      date_naissance : this.fb.control(null),
      genre : this.fb.control(null),
      departement_id : this.fb.control(null),
      poste : this.fb.control(null),
      email : this.fb.control(null),
      phone : this.fb.control(null),
    });
    this.updateUserFormGroup =this.fb.group({
      first_name : this.fb.control(null),
      last_name : this.fb.control(null),
      cin : this.fb.control(null),
      date_naissance : this.fb.control(null),
      genre : this.fb.control(null),
      departement_id : this.fb.control(null),
      poste : this.fb.control(null),
      email : this.fb.control(null),
      phone : this.fb.control(null),
      user_active : this.fb.control(null),
      verifie : this.fb.control(null),
      role : this.fb.control(null),
    });
    this.detailsUserFormGroup =this.fb.group({
      first_name : this.fb.control(null),
      last_name : this.fb.control(null),
      cin : this.fb.control(null),
      date_naissance : this.fb.control(null),
      genre : this.fb.control(null),
      depart : this.fb.control(null),
      poste : this.fb.control(null),
      email : this.fb.control(null),
      phone : this.fb.control(null),
      role : this.fb.control(null),
    });

    this.departFormGroup =this.fb.group({
      depart_name : this.fb.control(null),});

    this.updateDepartFormGroup =this.fb.group({
      depart_name : this.fb.control(null),});

    this.searchFormGroup =this.fb.group({
      searchTerm : this.fb.control(null),});

    this.detailsDepartFormGroup =this.fb.group({
      depart_name : this.fb.control(null),
      depart_length : this.fb.control(null),
    });

    this.handleUsersList();
    this.handleDepartsList();
    this.handleDesactivesList();
    this.handleNewUsersList();
    this.affichAdmin=1;
    this.loggedUser = this.authService.getLoggedUser();
    this.getUsers();
  }


  public getUsers(): void {
    this.subscriptions.push(
      this.usersService.getUsers().subscribe(
        (response: UserRespo) => {
          this.usersService.addUsersToLocalCache(response);
          this.users = this.users.pipe(
            map(data=>{
              return data;
            }))
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = errorResponse.error.message;
          return throwError(errorResponse);
        }
      )
    );
  }

  handleUsersList() {
    this.users = this.usersService.getUsers().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleDepartsList() {
    this.departements = this.departService.getDepartements().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }


  afficheurAdmin(num : number){
    this.affichAdmin = num;
  }


  handleDesactivesList() {
    this.desactives = this.usersService.getDesactives().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleNewUsersList() {
    this.newUsers = this.usersService.getNewUsers().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleAddDepartement() {
    this.departService.createDepartement(this.departFormGroup.value).subscribe({
      next: data => {
        Swal.fire("Le département a été ajouté avec succès");
        this.departFormGroup.value.depart_name = null;
        //this.newCustomerFormGroup.reset();
        this.router.navigateByUrl("/admin/dashboard");
      },
      error: err => {
        console.log(err);
      }
    })
  }

  handleAddUser() {
    let user:User=this.addUserFormGroup.value;
    this.usersService.addUser(user).subscribe({
      next : data => {
        Swal.fire("L'utilisateur a été enregistré avec succès");
        //this.newCustomerFormGroup.reset();
        this.getUsers();
        this.affichAdmin = 1;
      },
      error : err => {
        console.log(err);
      }
    });
  }


  handleDeleteDepartement(d: Departement) {
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer le département ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.departService.deleteDepartement(d).subscribe({
      next : (resp) =>{
        this.departements = this.departements.pipe(
          map(data=>{
            let index = data.data.indexOf(d);
            data.data.slice(index,1);
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
      }
    });

  }

  handleDeleteUser(user: User) {
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer l'utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.deleteUser(user).subscribe({
      next : (resp) =>{
        this.users = this.users.pipe(
          map(data=>{
            let index = data.data.indexOf(user);
            data.data.slice(index,1);
            return data;
          })
        );
        this.getUsers();
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la suppression :)', 'error');
      }
    });
  }

  handleDeleteUserDesactive(user: User) {
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer l'utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.deleteUser(user).subscribe({
      next : (resp) =>{
        this.desactives = this.desactives.pipe(
          map(data=>{
            let index = data.data.indexOf(user);
            data.data.slice(index,1);
            return data;
          })
        )
        this.getUsers();
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la suppression :)', 'error');
      }
    });
  }

  handleDeleteNewUser(user: User) {
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer l'utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.deleteUser(user).subscribe({
      next : (resp) =>{
        this.newUsers = this.newUsers.pipe(
          map(data=>{
            let index = data.data.indexOf(user);
            data.data.slice(index,1);
            return data;
          })
        )
        this.getUsers();
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la suppression :)', 'error');
      }
    });
  }

  validerInscription(user: User) {
    let data = {"user_active": true, "verifie":true}
    Swal.fire({
      title: 'Validation',
      text: "Voulez-vous valider l'inscription de cet utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.updateUser(user,data).subscribe({
      next : (resp) =>{
        this.getUsers();
        this.newUsers = this.newUsers.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la validation :)', 'error');
      }
    });

  }

  activerUser(user: User) {
    let data = {"user_active": true}
    Swal.fire({
      title: 'Activation',
      text: "Voulez-vous activer l'utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.updateUser(user,data).subscribe({
      next : (resp) =>{
        this.getUsers();
        this.desactives = this.desactives.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la validation :)', 'error');
      }
    });

  }

  desactiverUser(user: User) {
    let data = {"user_active": false}
    Swal.fire({
      title: 'Désactivation',
      text: "Voulez-vous désactiver l'utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.updateUser(user,data).subscribe({
      next : (resp) =>{
        this.getUsers();
        this.users = this.users.pipe(
          map(data=>{
            return data;
          })
        );
        this.desactives = this.desactives.pipe(
          map(data=>{
            return data;
          })
        );
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la validation :)', 'error');
      }
    });
  }

  affichUserDetails(user : User,affichAd : number ){
    this.affichAdmin = 6;
    this.userDetails = user;
    this.userDetailsRedirect = affichAd;
  }

  affichUpdateUser(user : User,affichAd : number ){
    this.affichAdmin = 7;
    this.userDetails = user;
    this.userUpdateRedirect = affichAd;
  }

  affDetailsRedirect(){
    this.affichAdmin = this.userDetailsRedirect;
  }

  handleUpdateUser(user : User) {
    let data = this.updateUserFormGroup.value
    this.usersService.updateUser(user,data).subscribe({
      next : (resp) =>{
        alert("User updated successfully")
        this.affichAdmin = this.userUpdateRedirect;
        this.getUsers();
      },
      error : err => {
        console.log(err);
      }
    })
  }

  updateRedirect() {
    this.affichAdmin = this.userUpdateRedirect;
  }

  handleUpdateDepartement(depart : Departement) {

    let data = this.updateDepartFormGroup.value
    this.departService.updateDepartement(depart,data).subscribe({
      next : (resp) =>{
        alert("Departement updated successfully")
        this.affichAdmin = this.userUpdateRedirect;
      },
      error : err => {
        console.log(err);
      }
    })

  }

  affichUpdateDepart(departement: Departement, affichAdm: number) {
    this.affichAdmin = 8;
    this.departementDetails = departement;
    this.userUpdateRedirect = affichAdm;
  }

  affichDepartDetails(departement : Departement, affichAdm: number) {
    this.affichAdmin = 9;
    this.departementDetails = departement;
    this.userUpdateRedirect = affichAdm;
  }

  affDepartDetailsRedirect(){
    this.affichAdmin = this.userUpdateRedirect;
  }

  handleLogOut(num: number) {
    this.affichAdmin = num;
    Swal.fire({
      title: 'Déconnexion',
      text: "Voulez-vous vous déconnecter ?",
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem("token");
        this.router.navigateByUrl("/");
      }
    });
  }

  searchUsers(text : any, utilis : UserRespo){
   // let userRespoTab: UserRespo;
    //userRespoTab = this.users as Observable<UserRespo> as UserRespo;
    this.getUsers();
    console.log(text.searchTerm)
    console.log(utilis)
    const results: User[] = [];
    const resultRespo: UserRespo = utilis;
    for (const user of this.usersService.getUsersFromLocalCache().data) {
      if (user.first_name.toLowerCase().indexOf(text.searchTerm.toLowerCase()) !== -1 ||
        user.last_name.toLowerCase().indexOf(text.searchTerm.toLowerCase()) !== -1 ||
        user.cin.toLowerCase().indexOf(text.searchTerm.toLowerCase()) !== -1 ) {
        results.push(user);
      }
    }
    resultRespo.data = results
    this.users = of(resultRespo);
    if (results.length === 0 || !text) {
      this.users = of(utilis);
    }
  }

}
