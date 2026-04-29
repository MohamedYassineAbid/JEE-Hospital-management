import { RendezVous } from './rendezvous.model';

export interface Consultation {
    id?: number;
    dateConsultation: Date | string;
    rapport: string;
    rendezVous?: RendezVous;
}
