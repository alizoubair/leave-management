import { User } from "./user.model";

  export interface Conge {
    id: number;
    date_debut: string;
    date_fin: string;
    description: string;
    userId: number;
    status: string;
    demande_annulation: number;
    pas_annule: number;
    propose: number;
    ajoute: number;
    user: User;
  }

  export interface CongeRespo {
    status: number;
    message: string;
    data: Conge[];
  }

  export interface SingleCongeRespo {
    status: number;
    message: string;
    data: Conge;
  }



