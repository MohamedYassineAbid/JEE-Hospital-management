package ma.fss.service;

import ma.fss.entities.Appointment;
import ma.fss.entities.Consultation;
import ma.fss.entities.Doctor;
import ma.fss.entities.Patient;

public interface IHospitalService {
    Patient savePatient(Patient patient);
    Doctor saveDoctor(Doctor doctor);
    Appointment saveAppointment(Appointment appointment);
    Consultation saveConsultation(Consultation consultation);
}
