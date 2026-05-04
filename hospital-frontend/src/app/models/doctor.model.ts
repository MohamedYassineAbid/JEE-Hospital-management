import { Hospital } from './hospital.model';

export interface Doctor {
  id?: number;
  name: string;
  email: string;
  specialty: string;
  hospital?: Hospital;
}
