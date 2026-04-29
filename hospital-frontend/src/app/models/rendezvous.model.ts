import { Patient } from './patient.model';
import { Medecin } from './medecin.model';

export type StatusRDV = 'PENDING' | 'CANCELED' | 'DONE';

export interface RendezVous {
    id?: number;
    date: Date | string;
    statusRDV: StatusRDV;
    patient?: Patient;
    medecin?: Medecin;
}
