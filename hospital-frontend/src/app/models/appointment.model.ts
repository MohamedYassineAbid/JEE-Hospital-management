import { Patient } from "./patient.model";
import { Doctor } from "./doctor.model";

export interface Appointment {
    id?: number;
    date: string;
    session: string;
    status: string;
    patient?: Patient;
    doctor?: Doctor;
    patientId?: number;
    doctorId?: number;
}
