package ma.fss.service;

import ma.fss.entities.Consultation;
import ma.fss.entities.Doctor;
import ma.fss.entities.Patient;
import ma.fss.entities.Appointment;

import java.util.Date;
import java.util.Map;

public interface IHospitalService {
    Patient savePatient(Patient patient);
    Doctor saveDoctor(Doctor doctor);
    Appointment saveAppointment(Appointment appointment);
    Consultation saveConsultation(Consultation consultation);
    
    // Pro Clinical Flow
    Consultation completeAppointment(Long appointmentId, String report);
    
    // Dashboard Stats
    Map<String, Object> getDoctorStats(String username);
    Map<String, Object> getPatientStats(String username);
    
    // Healing Center Availability Logic
    Map<String, Boolean> checkAvailability(Long doctorId, Date date, Long excludeAppointmentId);
    Map<String, Boolean> checkAvailabilityByUsername(String username, Date date, Long excludeAppointmentId);
}
