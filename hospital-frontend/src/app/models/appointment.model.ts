import { Patient } from './patient.model';
import { Doctor } from './doctor.model';
import { Hospital } from './hospital.model';

export interface Appointment {
  id?: number;
  date: string;
  status: string;
  patient?: Patient;
  doctor?: Doctor;
  hospital?: Hospital;
}
