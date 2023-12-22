import {Conge} from "./conge.model";
import {User} from "./user.model";

export interface Departement {
    id: number;
    depart_name: string;
    users : User[];
  }

  export interface DepartementRespo {
    status: number;
    message: string;
    data: Departement[];
  }

export interface SingleDepartementRespo {
  status: number;
  message: string;
  data: Departement;
}



