import {Departement} from "./departement.model";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  cin: string;
  date_naissance: Date;
  genre: string;
  email: string;
  role: string;
  password: string;
  password_confirmation: string;
  phone: string;
  image: string;
  score: number;
  verifie: number;
  user_active: number;
  departement_id: number;
  poste: string;
  departement : Departement;
}

export interface UserRespo {
  status: number;
  message: string;
  data: User[];
}

export interface SingleUserRespo {
  status: number;
  message: string;
  data: User;
}
