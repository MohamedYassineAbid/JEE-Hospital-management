package ma.fss.service;

import ma.fss.entities.Appointment;
import ma.fss.entities.Consultation;
import ma.fss.entities.Doctor;
import ma.fss.entities.Patient;
import ma.fss.repositories.AppointmentRepository;
import ma.fss.repositories.ConsultationRepository;
import ma.fss.repositories.DoctorRepository;
import ma.fss.repositories.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HospitalServiceImpl implements IHospitalService {

    private PatientRepository patientRepository;
    private DoctorRepository doctorRepository;
    private AppointmentRepository appointmentRepository;
    private ConsultationRepository consultationRepository;

    public HospitalServiceImpl(PatientRepository patientRepository, DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, ConsultationRepository consultationRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.consultationRepository = consultationRepository;
    }

    @Override
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public Consultation saveConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }
}
