import { Appointment } from "./appointment.model";

export interface Consultation {
    id?: number;
    consultationDate: string;
    report: string;
    appointment?: Appointment;
    appointmentId?: number;
}
