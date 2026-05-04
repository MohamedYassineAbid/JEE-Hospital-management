import { Hospital } from './hospital.model';

export interface Patient {
  id?: number;
  name: string;
  birthDate: string;
  sick: boolean;
  address: string;
  zipCode: string;
  phoneNumber: string;
  title: string;
  hospital?: Hospital;
}
