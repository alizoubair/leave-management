import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {CongesService} from "../../services/conges.service";
import {SingleUserRespo, User, UserRespo} from "../../model/user.model";
import {Conge, CongeRespo} from "../../model/conge.model";
import {catchError, map, Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



import {dateValidator} from "../../validation/date.validation";
import Swal from 'sweetalert2';
import {DepartementRespo} from "../../model/departement.model";
import {DepartementService} from "../../services/departement.service";
import {Holiday, HolidayRespo} from "../../model/holiday.model";

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent implements OnInit {
  userConnecte! : Observable<SingleUserRespo>;
  loggedUser : any;
  isList!: number;
  isMenu!: boolean;
  congeFormGroup!: FormGroup;
  conges!: Observable<CongeRespo>
  allConges!: Observable<CongeRespo>
  userPendingConges!: Observable<CongeRespo>
  userNotPendingConges!: Observable<CongeRespo>
  allPendingConges!: Observable<CongeRespo>
  allNotPendingConges!: Observable<CongeRespo>
  inProgressConges!: Observable<CongeRespo>
  suggestedConges!: Observable<CongeRespo>
  archivedConges!: Observable<CongeRespo>
  congesEnDemandeAnnulation! : Observable<CongeRespo>
  allAddedConges! : Observable<CongeRespo>
  errorMessage!: string;
  p!: number;
  p2!: number;
  p3!: number;
  p4!: number;
  pAdded!: number;
  pNotPending!: number;
  pPending!: number;
  pInProgress!: number;
  pArchived!: number;
  pAnnul!: number;
  affichAdmin!:number;
  affichUser!:number;
  affichManager!:number;
  congeDetails! : Conge;
  congeDownload! : Conge;
  updateRedirect!: number;
  congeUpdateFormGroup!: FormGroup;
  userPendingCongeUpdateFormGroup!: FormGroup;
  congeProposeFormGroup!: FormGroup;
  companyName : string = environment.companyName;
  profileImageAdress : String = environment.profilePicHost;
  updateUserProfileFormGroup!: FormGroup;
  departements! : Observable<DepartementRespo>;
  profileImage! : File | undefined;
  updateManagerProfileFormGroup!: FormGroup;
  holidays! : Observable<HolidayRespo>
  holidays_dates!: HolidayRespo
  holidayFormGroup !: FormGroup
  congesInSameTimeSameDepart! : Observable<CongeRespo>
  congesInSameTimeAllDeparts! : Observable<CongeRespo>
  users! : Observable<UserRespo>;
  user! : User;
  searchFormGroup!: FormGroup;
  addCongeToUserFormGroup!: FormGroup;
  searchFormGroupNotPending!: FormGroup;
  searchFormGroupInProgress!: FormGroup;
  searchFormGroupArchived!: FormGroup;
  searchFormGroupAdded!: FormGroup;


  constructor(private authService: AuthenticationService,private congeService:CongesService,private usersService : UserService,private departService : DepartementService, private fb: FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.congeFormGroup =this.fb.group({
      date_debut : this.fb.control(null, [Validators.required]),
      date_fin : this.fb.control(null, [Validators.required]),
      description : this.fb.control(null),
      user_id : this.fb.control(null),
    },  { });
    this.addCongeToUserFormGroup =this.fb.group({
        date_debut : this.fb.control(null, [Validators.required]),
        date_fin : this.fb.control(null, [Validators.required]),
        user_id : this.fb.control(null),
        status : this.fb.control(null),
      }),
    this.congeUpdateFormGroup =this.fb.group({
      date_debut : this.fb.control(null),
      date_fin : this.fb.control(null),
      status : this.fb.control(null),
    });
    this.userPendingCongeUpdateFormGroup =this.fb.group({
      date_debut : this.fb.control(null),
      date_fin : this.fb.control(null),
      description : this.fb.control(null),
    });

    this.congeProposeFormGroup =this.fb.group({
      date_debut : this.fb.control(null),
      date_fin : this.fb.control(null),
      user_id : this.fb.control(null),
    });
    this.loggedUser = this.authService.getLoggedUser();
    //this.handleUserCongesList();
   // this.handleUserAllCongesList();

    this.updateUserProfileFormGroup =this.fb.group({
      first_name : this.fb.control(null),
      last_name : this.fb.control(null),
      date_naissance : this.fb.control(null),
      image : this.fb.control(null),
      departement_id : this.fb.control(null),
      poste : this.fb.control(null),
      email : this.fb.control(null),
      phone : this.fb.control(null),
      password : this.fb.control(null),
      password_confirmation : this.fb.control(null),
      user_active : this.fb.control(null),
      verifie : this.fb.control(null),
      cin : this.fb.control(null),
      score : this.fb.control(null),
      genre : this.fb.control(null),
      role : this.fb.control(null)
    });


    this.updateManagerProfileFormGroup =this.fb.group({
      first_name : this.fb.control(null),
      last_name : this.fb.control(null),
      date_naissance : this.fb.control(null),
      image : this.fb.control(null),
      departement_id : this.fb.control(null),
      poste : this.fb.control(null),
      email : this.fb.control(null),
      phone : this.fb.control(null),
      password : this.fb.control(null),
      password_confirmation : this.fb.control(null),
      user_active : this.fb.control(null),
      verifie : this.fb.control(null),
      cin : this.fb.control(null),
      score : this.fb.control(null),
      genre : this.fb.control(null),
      role : this.fb.control(null)
    });

    this.searchFormGroup =this.fb.group({
      searchTerm : this.fb.control(null)})
    this.searchFormGroupNotPending =this.fb.group({
      searchTerm : this.fb.control(null)})
    this.searchFormGroupInProgress =this.fb.group({
      searchTerm : this.fb.control(null)})
    this.searchFormGroupArchived =this.fb.group({
      searchTerm : this.fb.control(null)})
    this.searchFormGroupAdded =this.fb.group({
      searchTerm : this.fb.control(null)})


    this.holidayFormGroup =this.fb.group({
      holiday_date : this.fb.control(null),
      description : this.fb.control(null),
    });

    this.handleDepartsList();
    this.handleHolidaysList();
    this.handleHolidaysDatesList();
   if (this.loggedUser.role=='manager'){
     this.handleAllPendingCongesList();
     this.handleAllNotPendingCongesList();
     this.handleInProgressCongesList();
     this.handleDemandeAnnulationCongesList();
     this.handleArchivedCongesList();
     this.handleUsersList();
     this.handleAllAddedCongesList();
   }else{
     this.handleUserPendingCongesList();
     this.handleUserNotPendingCongesList();
     this.handleUserSuggestedCongesList();
  }

    this.affichAdmin = 1;
    this.affichUser = 1;
    this.affichManager = 1;
    this.handleUserConnecte();

  }

  handleUsersList() {
    this.users = this.usersService.getUsers().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleSearchUsersList() {
    console.log(this.searchFormGroup.value.searchTerm)
    this.users = this.usersService.searchUsers(this.searchFormGroup.value.searchTerm).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  affUser(num : number) {
    this.affichUser=num;
  }

  affichManag(num : number) {
    this.affichManager=num;
  }

  handleUserConnecte(){
    this.userConnecte = this.usersService.getUser(this.loggedUser.id).pipe(
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

  handleAddConge(user : User, holidays : Holiday[]) {
    let conge: Conge = this.congeFormGroup.value;
    let userScore = user.score;
    let nbreJoursDemandes = this.congeService.nbrejourConges(new Date(conge.date_debut), new Date(conge.date_fin),holidays);
    if(new Date(conge.date_fin).getTime() <= new Date(conge.date_debut).getTime() || new Date(conge.date_debut).getTime() < new Date().getTime()){
      Swal.fire("Erreur","-La date début doit etre avant la date fin\n-La date debut doit etre après aujoud'hui", "error")
    }
    else if(nbreJoursDemandes<=0){
      Swal.fire("Erreur","Le nombre de jours du congé ne doit pas être nul", "error")
    }
    else if (userScore < nbreJoursDemandes) {
      Swal.fire("Erreur","Le nombre de jours demandés depasse votre score actuel", "error")
    } else {
      let data = {"score" : userScore - nbreJoursDemandes, "user_active" : true }

      this.congeService.demandeConge(conge).subscribe({
        next: data => {
          console.log(this.congeService.nbrejourConges(new Date(conge.date_debut), new Date(conge.date_fin),holidays))
          Swal.fire("Success","La demande de congé a été envoyé avec succès !", "success")
          //this.router.navigateByUrl("/dashboard");
          this.affichUser = 1
        },
        error: err => {
          console.log(err);
        }
      });

      this.usersService.updateUserScore(user,data).subscribe({
        next : (resp) =>{
          this.userConnecte = this.userConnecte.pipe(
            map(data=>{
              return data;
            })
          )
        },
        error : err => {
          console.log(err);
        }
      });
    }
  }


  handleAddCongeToUser(user : User, holidays : Holiday[]) {
    let conge: Conge = this.addCongeToUserFormGroup.value;
    conge.status = 'Accordé';
    conge.ajoute = 1;

    let userScore = user.score;
    let nbreJoursDemandes = this.congeService.nbrejourConges(new Date(conge.date_debut), new Date(conge.date_fin),holidays);
    let diff = userScore - nbreJoursDemandes;
    if(nbreJoursDemandes==0){
      Swal.fire("Erreur","Le nombre de jours du congé ne doit pas être nul", "error")
    } else if(new Date(conge.date_fin).getTime() <= new Date(conge.date_debut).getTime()){
      Swal.fire("Erreur","La date début doit etre avant la date fin", "error")
    }
    else if (userScore < nbreJoursDemandes) {
      Swal.fire("Erreur","Le nombre de jours demandés depasse le score de l'employé", "error")
    } else {
      let data = {"score" :diff, "user_active" : user.user_active }

      this.congeService.demandeConge(conge).subscribe({
        next: data => {
          console.log(this.congeService.nbrejourConges(new Date(conge.date_debut), new Date(conge.date_fin),holidays))
          Swal.fire("Success","Le congé a été ajouté avec succès !", "success")
          //this.router.navigateByUrl("/dashboard");
          this.affichManager = 12
        },
        error: err => {
          Swal.fire("Erreur","Le congé n'a pas été ajouté !", "error");
          return;
        }
      });

      this.usersService.updateUserScore(user,data).subscribe({
        next : (resp) =>{
          this.users = this.users.pipe(
            map(data=>{
              return data;
            })
          )
        },
        error : err => {
          Swal.fire("Erreur","Erreur de mise à jour de l'employé !", "error")

        }
      });
    }
  }

  handleNbreJoursConge(conge : Conge){
    return this.congeService.nbrejourConges(new Date(conge.date_debut),new Date(conge.date_fin),this.holidays_dates.data)
  }

  handleUserCongesList() {
    this.conges = this.congeService.getUserConges(this.loggedUser.id).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleUserAllCongesList() {
    this.allConges = this.congeService.getConges().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleUserPendingCongesList() {
    this.userPendingConges = this.congeService.getUserCongesPending(this.loggedUser.id).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }


  handleUserNotPendingCongesList() {
    this.userNotPendingConges = this.congeService.getUserCongesNotPending(this.loggedUser.id).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }



  handleUserSuggestedCongesList() {
    this.suggestedConges = this.congeService.getSuggestedConges(this.loggedUser.id).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleAllPendingCongesList() {
    this.allPendingConges = this.congeService.getAllCongesPending().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }


  handleAllNotPendingCongesList() {
    this.allNotPendingConges = this.congeService.getAllCongesNotPending().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }
  searchNotPendingCongesList() {
    this.allNotPendingConges = this.congeService.searchCongesNotPending(this.searchFormGroupNotPending.value.searchTerm).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleInProgressCongesList() {
    this.inProgressConges = this.congeService.getInProgressConges().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }
  searchInProgressCongesList() {
    this.inProgressConges = this.congeService.searchInProgressConges(this.searchFormGroupInProgress.value.searchTerm).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleArchivedCongesList() {
    this.archivedConges = this.congeService.getArchivedConges().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }
  searchArchivedCongesList() {
    this.archivedConges = this.congeService.searchArchivedConges(this.searchFormGroupArchived.value.searchTerm).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleAllAddedCongesList() {
    this.allAddedConges = this.congeService.getAllAddedConges().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  searchAddedCongesList() {
    this.allAddedConges = this.congeService.searchAddedConges(this.searchFormGroupAdded.value.searchTerm).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleDemandeAnnulationCongesList() {
    this.congesEnDemandeAnnulation = this.congeService.getDemandeAnnulationConges().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleCongeInSameTimeSameDepart(id : number) {
    this.congesInSameTimeSameDepart = this.congeService.getCongesInSameTimeSameDepart(id).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleCongeInSameTimeAllDeparts(id : number) {
    this.congesInSameTimeAllDeparts = this.congeService.getCongesInSameTimeAllDeparts(id).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }


  affichDetails(conge: Conge) {
    this.affichManager = 3;
    this.congeDetails = conge;
    this.handleCongeInSameTimeSameDepart(conge.id);
    this.handleCongeInSameTimeAllDeparts(conge.id);
  }

  handleUpdateConge(conge : Conge, affichMgr: number) {
    this.congeDetails = conge
    this.affichManager = 4
    this.updateRedirect = affichMgr;
  }

  accorderConge(conge: Conge) {
    let data = {"status": "Accordé"}
    Swal.fire({
      title: 'Accorder',
      text: "Voulez-vous accorder le congé ?",
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        this.allPendingConges = this.allPendingConges.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    })
    this.congeService.congratsMail(conge.id).subscribe({
      next : (resp) =>{
        Swal.fire("","Vous avez accordé le congé et le demandeur a été notifié par mail", "success")
      },
      error : err => {
        Swal.fire("","Vous avez accordé le congé et mais le demandeur n'a pas été notifié par mail", "warning")
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé :)', 'error');
      }
    });
  }

  refuserConger(conge : Conge) {
    let data = {"status": "Refusé"}
    let nbreJours = this.handleNbreJoursConge(conge);
    let userData = {"score" : conge.user.score + nbreJours, "user_active" : conge.user.user_active }
    Swal.fire({
      title: 'Refus',
      text: "Voulez-vous réfuser la demande de congé ?",
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        this.allPendingConges = this.allPendingConges.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
    this.usersService.updateUser(conge.user,userData).subscribe({
      next : (resp) =>{
        console.log(conge.user.user_active)
      },
      error : err => {
        console.log(err);
      }
    });
    this.congeService.notAcceptedMail(conge.id).subscribe({
      next : (resp) =>{
        Swal.fire("","Vous avez refusé le congé et le demandeur a été notifié par mail", "success")
      },
      error : err => {
        Swal.fire("","Vous avez refusé le congé et mais le demandeur n'a pas été notifié par mail", "warning")
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé :)', 'error');
      }
    });
  }

  accorderCongeDetails(congeDetails: Conge) {
    this.accorderConge(congeDetails);
    this.affichManager = 1;
  }

  refuserCongerDetails(congeDetails: Conge) {
    this.refuserConger(congeDetails);
    this.affichManager = 1;
  }

  updateConge(conge : Conge) {
    let data = this.congeUpdateFormGroup.value
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        Swal.fire("Le congé a été mis à jour avec succès")
        this.affichManager = this.updateRedirect;
      },
      error : err => {
        console.log(err);
      }
    })
  }

  handleDeleteUserPendingConge(conge : Conge) {
    let nbreJours = this.handleNbreJoursConge(conge);
    let userData = {"score" : conge.user.score + nbreJours, "user_active" : conge.user.user_active }
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer le conge ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.congeService.deleteConge(conge).subscribe({
          next : (resp) =>{
            this.userPendingConges = this.userPendingConges.pipe(
              map(data=>{
                let index = data.data.indexOf(conge);
                data.data.slice(index,1);
                return data;
              })
            )
          },
          error : err => {
            console.log(err);
          }
        });

        this.usersService.updateUserScore(conge.user,userData).subscribe({
          next : (resp) =>{
            Swal.fire("","Le score a été mis à jour !", "success")
          },
          error : err => {
            console.log(err);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez arreter la demande d\'annulation :)', 'error');
      }
    });

  }

  handleUpdateUserPendingConge(conge: Conge, affUser : number) {

    this.congeDetails = conge
    this.affichUser = 4
    this.updateRedirect = affUser;

  }

  updateUserPendingConge(conge : Conge){

    let data = this.userPendingCongeUpdateFormGroup.value
    console.log(data)
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        Swal.fire("Le congé a été mis à jour avec succès")
        this.affichUser = this.updateRedirect;
      },
      error : err => {
        console.log(err);
      }
    })
  }

  demandeAnnulation(conge : Conge) {
    let data = {demande_annulation: true}

    //let conf = confirm("Voulez-vous demandez l'annulation du conge ?");
    //if(!conf) return;

    Swal.fire({
      title: 'Etes-vous sûr?',
      text: "Voulez-vous demandez l\'annulation du conge ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.congeService.updateConge(conge,data).subscribe({
          next : (resp) =>{
            this.userNotPendingConges = this.userNotPendingConges.pipe(
              map(data=>{
                return data;
              })
            )
          },
          error : err => {
            console.log(err);
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Annulé', 'Vous avez arreter la demande d\'annulation :)', 'error');
      }
    });
  }

  accepterAnnnulation(conge: Conge) {
    let data = {"status":"Annulé"}
    let nbreJours = this.handleNbreJoursConge(conge);
    let userData = {"score" : conge.user.score + nbreJours, "user_active" : conge.user.user_active }
    Swal.fire({
      title: 'Annulation',
      text: "Voulez-vous annuler le congé ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.usersService.updateUser(conge.user,userData).subscribe({
      next : (resp) =>{
        console.log(conge.user.user_active)
      },
      error : err => {
        console.log(err);
      }
    })

    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        Swal.fire("Annulation", 'Le congé a été annulé avec succès', 'success')
        this.congesEnDemandeAnnulation = this.congesEnDemandeAnnulation.pipe(
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
        // Swal.fire('Annulé', 'Vous avez annulé l'annulation :)', 'error');
      }
    });
  }

  refuserAnnulation(conge: Conge) {
    let data = {"pas_annule":true}
    Swal.fire({
      title: 'Annulation',
      text: "Ne pas annuler le congé ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        Swal.fire("Le congé est maintenu")
        this.congesEnDemandeAnnulation = this.congesEnDemandeAnnulation.pipe(
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
        // Swal.fire('Annulé', 'Vous avez annulé l'annulation :)', 'error');
      }
    });
  }

  proposerAutreDate(conge: Conge) {
    this.congeDetails = conge;
    this.affichManager = 9;
  }

  handleproposerAutreDate(conge: Conge) {
    let data = { "date_debut": this.congeProposeFormGroup.value.date_debut,
                 "date_fin": this.congeProposeFormGroup.value.date_fin,
                 "user_id": this.congeProposeFormGroup.value.user_id,
                  "propose": true
    }
    let userData = {"score" : conge.user.score + this.handleNbreJoursConge(conge) , "user_active" : this.congeDetails.user.user_active }

    if(this.congeService.nbrejourConges(new Date(data.date_debut),new Date(data.date_fin),this.holidays_dates.data) > conge.user.score){
      Swal.fire("","Le score de cet utilisateur est insuffisant","error")
    }
    else {
      console.log(data)
      this.congeService.demandeConge2(data).subscribe({
        next: (resp) => {
          Swal.fire("", "La proposition de conge a été effectuée", "success")
          this.affichManager = 1
        },
        error: err => {
          console.log(err);
        }
      })

      this.usersService.updateUser(conge.user, userData).subscribe({
        next: (resp) => {
          console.log("conge2 --->", conge)
          console.log("userDate2--->",userData)
          console.log(conge.user.user_active)
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  accepterProposition(conge : Conge) {
    let data = {
      "status": "Accordé"
    }
    Swal.fire({
      title: 'Proposition',
      text: "Voulez-vous accepter la proposition de congé ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    let nbreJours = this.handleNbreJoursConge(conge)
    let userData = {"score" : conge.user.score - nbreJours , "user_active" : conge.user.user_active }

    if(this.congeService.nbrejourConges(new Date(conge.date_debut),new Date(conge.date_fin),this.holidays_dates.data) > conge.user.score){
      Swal.fire("","Votre est insuffisant ! ","error")
    }
    else {
      console.log(data)
      this.congeService.updateConge(conge, data).subscribe({
        next: (resp) => {
          Swal.fire("Félicitations", "Vous avez un congé du " + conge.date_debut + " au " + conge.date_fin, "success")
          this.userConnecte = this.userConnecte.pipe();
        },
        error: err => {
          console.log(err);
        }
      })

      this.usersService.updateUser(conge.user, userData).subscribe({
        next: (resp) => {
          console.log(conge.user.user_active)
          this.affichUser = 2
        },
        error: err => {
          console.log(err);
        }
      })
    }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez refusé la proposition :)', 'error');
      }
    });
  }

  refuserProposition(conge : Conge) {
    let data = {
      "status": "Refusé"
    }
    Swal.fire({
      title: 'Proposition',
      text: "Voulez-vous refuser la proposition de congé ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        Swal.fire("","Vous avez refusé la proposition de congé","success")
        this.affichUser=2
      },
      error : err => {
        console.log(err);
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé :)', 'error');
      }
    });
  }

  handleDeleteArchivedConge(conge: Conge) {
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer le conge ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.congeService.deleteConge(conge).subscribe({
          next : (resp) =>{
            this.archivedConges = this.archivedConges.pipe(
              map(data=>{
                let index = data.data.indexOf(conge);
                data.data.slice(index,1);
                return data;
              })
            )
          },
          error : err => {
            console.log(err);
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez arreter la demande d\'annulation :)', 'error');
      }
    });
  }

  monProfile() {

  }

  deconnexion() {
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

  uploadfile(event: Event) {
    this.profileImage = (event.target as HTMLInputElement)?.files?.[0];
  }

  handleUpdateProfile(user: User) {
    var myFormData = new FormData();
    myFormData.append('first_name', this.updateUserProfileFormGroup.value.first_name);
    myFormData.append('last_name', this.updateUserProfileFormGroup.value.last_name);
    myFormData.append('date_naissance', this.updateUserProfileFormGroup.value.date_naissance);
    myFormData.append('email', this.updateUserProfileFormGroup.value.email);
    myFormData.append('password', this.updateUserProfileFormGroup.value.password);
    myFormData.append('password_confirmation', this.updateUserProfileFormGroup.value.password_confirmation);
    myFormData.append('phone', this.updateUserProfileFormGroup.value.phone);
    myFormData.append('departement_id', this.updateUserProfileFormGroup.value.departement_id);
    myFormData.append('poste', this.updateUserProfileFormGroup.value.poste);
    myFormData.append('user_active', this.updateUserProfileFormGroup.value.user_active);
    myFormData.append('verifie', this.updateUserProfileFormGroup.value.verifie);
    myFormData.append('cin', this.updateUserProfileFormGroup.value.cin);
    myFormData.append('score', this.updateUserProfileFormGroup.value.score);
    myFormData.append('genre', this.updateUserProfileFormGroup.value.genre);
    myFormData.append('role', this.updateUserProfileFormGroup.value.role);
    // @ts-ignore
    myFormData.append('image', this.profileImage);

    this.usersService.updateUserProfile(user,myFormData).subscribe({
      next : data => {
        Swal.fire("","Votre profil a été mis à jour avec succès !");
        //this.newCustomerFormGroup.reset();
        this.userConnecte = this.userConnecte.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
  }

  handleUpdateManagerProfile(user: User) {
    var myFormData = new FormData();
    myFormData.append('first_name', this.updateManagerProfileFormGroup.value.first_name);
    myFormData.append('last_name', this.updateManagerProfileFormGroup.value.last_name);
    myFormData.append('date_naissance', this.updateManagerProfileFormGroup.value.date_naissance);
    myFormData.append('email', this.updateManagerProfileFormGroup.value.email);
    myFormData.append('password', this.updateManagerProfileFormGroup.value.password);
    myFormData.append('password_confirmation', this.updateManagerProfileFormGroup.value.password_confirmation);
    myFormData.append('phone', this.updateManagerProfileFormGroup.value.phone);
    myFormData.append('departement_id', this.updateManagerProfileFormGroup.value.departement_id);
    myFormData.append('poste', this.updateManagerProfileFormGroup.value.poste);
    myFormData.append('user_active', this.updateManagerProfileFormGroup.value.user_active);
    myFormData.append('verifie', this.updateManagerProfileFormGroup.value.verifie);
    myFormData.append('cin', this.updateManagerProfileFormGroup.value.cin);
    myFormData.append('score', this.updateManagerProfileFormGroup.value.score);
    myFormData.append('genre', this.updateManagerProfileFormGroup.value.genre);
    myFormData.append('role', this.updateManagerProfileFormGroup.value.role);
    // @ts-ignore
    myFormData.append('image', this.profileImage);

    this.usersService.updateUserProfile(user,myFormData).subscribe({
      next : data => {
        Swal.fire("","Votre profil a été mis à jour avec succès !");
        //this.newCustomerFormGroup.reset();
        this.userConnecte = this.userConnecte.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
  }


  handleHolidaysList() {
    this.holidays = this.congeService.getHolidays().pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  handleDeleteHoliday(holiday: Holiday) {
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer ce jour ferié ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.congeService.deleteHoliday(holiday.id).subscribe({
          next : (resp) =>{
            this.holidays = this.holidays.pipe(
              map(data=>{
                let index = data.data.indexOf(holiday);
                data.data.slice(index,1);
                return data;
              })
            )
          },
          error : err => {
            console.log(err);
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez arreter la demande d\'annulation :)', 'error');
      }
    });
  }

  handleAddHoliday(){
    let holiday : Holiday = this.holidayFormGroup.value;
    console.log(holiday)
    this.congeService.addHoliday(holiday).subscribe({
      next: data => {
        Swal.fire("Success","Le jour ferié a été ajouté avec succès !", "success")
        //this.router.navigateByUrl("/dashboard");
        this.holidays = this.holidays.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error: err => {
        console.log(err);
      }
    });
  }


  handleHolidaysDatesList() {
    this.congeService.getHolidays().subscribe(
      res=>this.holidays_dates = res as HolidayRespo,
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    )
  }

  @ViewChild('userDownload') invoiceElement!: ElementRef;
  userPdfDownload() {
    //this.affichUser=15
    console.log("conge download .... : ", this.congeDownload)
   // let DATA: any = document.getElementById('userDownload');
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight);
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save('attestation-congé.pdf');
    });
  }


  userPdf(conge : Conge){
    this.congeDownload = conge
    this.affichUser=15
  }

  managerPdf(conge : Conge){
    this.congeDownload = conge
    this.affichManager=14
  }

  @ViewChild('managerDownload') manElement!: ElementRef;
  managerPdfDownload() {
    // let DATA: any = document.getElementById('userDownload');
    html2canvas(this.manElement.nativeElement, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight);
      PDF.html(this.manElement.nativeElement.innerHTML)
      PDF.save('attestation-congé.pdf');
    });
  }

  ajouterCongeAUser(user: User) {
    this.affichManager = 13;
    this.user = user;
  }

  modifierStatutAAccorder(conge : Conge) {
    let data = {"status": "Accordé"}
    let nbreJours = this.handleNbreJoursConge(conge);
    if(conge.user.score<nbreJours){
      Swal.fire("","Le score de l'employé est insuffisant","error");
    }else {
      Swal.fire({
        title: 'Modifier',
        text: "Accorder le congé ?",
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      }).then((result) => {
        if (result.value) {
      let userData = {"score": conge.user.score - nbreJours, "user_active": conge.user.user_active}
      this.congeService.updateConge(conge, data).subscribe({
        next: (resp) => {
          this.allNotPendingConges = this.allNotPendingConges.pipe(
            map(data => {
              return data;
            })
          )
        },
        error: err => {
          console.log(err);
        }
      });
      this.usersService.updateUserScore(conge.user, userData).subscribe({
        next: (resp) => {
          console.log(conge.user.user_active)
        },
        error: err => {
          console.log(err);
        }
      });
      this.congeService.congratsMail(conge.id).subscribe({
        next: (resp) => {
          Swal.fire("", "Vous avez accepté le congé et le demandeur a été notifié par mail", "success")
        },
        error: err => {
          Swal.fire("", "Vous avez accepté le congé et mais échec de l'envoi du mail", "warning")
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Swal.fire('Annulé', 'Vous avez annulé la validation :)', 'error');
    }
  });
    }
  }

  modifierStatutARefuser(conge : Conge) {
    let data = {"status": "Refusé"}
    let nbreJours = this.handleNbreJoursConge(conge);
    let userData = {"score" : conge.user.score + nbreJours, "user_active" : conge.user.user_active }
    Swal.fire({
      title: 'Modifier',
      text: "Refuser le congé ?",
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
    this.congeService.updateConge(conge,data).subscribe({
      next : (resp) =>{
        this.allNotPendingConges = this.allNotPendingConges.pipe(
          map(data=>{
            return data;
          })
        )
      },
      error : err => {
        console.log(err);
      }
    });
    this.usersService.updateUserScore(conge.user,userData).subscribe({
      next : (resp) =>{
        console.log(conge.user.user_active)
      },
      error : err => {
        console.log(err);
      }
    });
    this.congeService.notAcceptedMail(conge.id).subscribe({
      next : (resp) =>{
        Swal.fire("","Vous avez refusé le congé et le demandeur a été notifié par mail", "success")
      },
      error : err => {
        Swal.fire("","Vous avez refusé le congé et mais le demandeur n'a pas été notifié par mail", "warning")
      }
    });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez annulé la validation :)', 'error');
      }
    });
  }

  handleDeleteActiveConge(conge: Conge) {
    let nbreJours = this.handleNbreJoursConge(conge);
    let userData = {"score" : conge.user.score + nbreJours, "user_active" : conge.user.user_active }
    Swal.fire({
      title: 'Suppresion',
      text: "Voulez-vous supprimer le conge ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.congeService.deleteConge(conge).subscribe({
          next : (resp) =>{
            this.allAddedConges = this.allAddedConges.pipe(
              map(data=>{
                let index = data.data.indexOf(conge);
                data.data.slice(index,1);
                return data;
              })
            )
          },
          error : err => {
            console.log(err);
          }
        });

        this.usersService.updateUserScore(conge.user,userData).subscribe({
          next : (resp) =>{
            Swal.fire("","Le score a été mis à jour !", "success")
          },
          error : err => {
            console.log(err);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Annulé', 'Vous avez arreter la demande d\'annulation :)', 'error');
      }
    });
  }
}



