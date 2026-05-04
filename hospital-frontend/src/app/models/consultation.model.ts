import { Appointment } from './appointment.model';
import { Hospital } from './hospital.model';

export interface Consultation {
  id?: number;
  consultationDate: string;
  report: string;
  appointment?: Appointment;
  hospital?: Hospital;
}
