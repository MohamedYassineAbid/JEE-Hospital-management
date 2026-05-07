package ma.fss.service;

import ma.fss.entities.*;
import ma.fss.repositories.ConsultationRepository;
import ma.fss.repositories.DoctorRepository;
import ma.fss.repositories.PatientRepository;
import ma.fss.repositories.AppointmentRepository;
import ma.fss.repositories.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
@Transactional
public class HospitalServiceImpl implements IHospitalService {
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;
    private final MessageRepository messageRepository;

    public HospitalServiceImpl(PatientRepository patientRepository,
                               DoctorRepository doctorRepository,
                               AppointmentRepository appointmentRepository,
                               ConsultationRepository consultationRepository,
                               MessageRepository messageRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.consultationRepository = consultationRepository;
        this.messageRepository = messageRepository;
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
        // ... (existing logic)
        if (appointment.getDoctor() == null || (appointment.getDoctor().getId() == null && appointment.getDoctor().getUsername() == null)) {
            throw new RuntimeException("Doctor ID or Username is required.");
        }
        
        Long medId = appointment.getDoctor().getId();
        if (medId == null) {
            Doctor med = doctorRepository.findByUsername(appointment.getDoctor().getUsername())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            medId = med.getId();
            appointment.setDoctor(med);
        } else {
            Doctor med = doctorRepository.findById(medId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            appointment.setDoctor(med);
        }

        if (appointment.getPatient() == null || (appointment.getPatient().getId() == null && appointment.getPatient().getUsername() == null)) {
            throw new RuntimeException("Patient ID or Username is required.");
        }

        if (appointment.getPatient().getId() == null) {
            Patient p = patientRepository.findByUsername(appointment.getPatient().getUsername())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            appointment.setPatient(p);
        } else {
            Patient p = patientRepository.findById(appointment.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            appointment.setPatient(p);
        }
        
        Map<String, Boolean> availability = checkAvailability(medId, appointment.getDate(), appointment.getId());
        if (!availability.getOrDefault(appointment.getSession(), false)) {
            throw new RuntimeException("Doctor is not available for this session (Capacity reached).");
        }
        
        return appointmentRepository.save(appointment);
    }

    @Override
    public Consultation saveConsultation(Consultation consultation) {
        if (consultation.getAppointment() == null || consultation.getAppointment().getId() == null) {
            throw new RuntimeException("Appointment ID is required for consultation.");
        }
        
        Appointment appt = appointmentRepository.findById(consultation.getAppointment().getId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        consultation.setAppointment(appt);
        
        return consultationRepository.save(consultation);
    }

    @Override
    public Consultation completeAppointment(Long appointmentId, String report) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // 1. Mark Appointment as DONE
        appt.setStatus(AppointmentStatus.DONE);
        appointmentRepository.save(appt);
        
        // 2. Create Consultation Record
        Consultation consultation = new Consultation();
        consultation.setAppointment(appt);
        consultation.setConsultationDate(new Date());
        consultation.setReport(report);
        
        return consultationRepository.save(consultation);
    }

    @Override
    public Map<String, Boolean> checkAvailability(Long doctorId, Date date, Long excludeAppointmentId) {
        // ... (existing logic)
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Map<String, Boolean> availability = new HashMap<>();
        
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(date);
        cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
        cal.set(java.util.Calendar.MINUTE, 0);
        cal.set(java.util.Calendar.SECOND, 0);
        cal.set(java.util.Calendar.MILLISECOND, 0);
        Date searchDate = cal.getTime();

        String dayOfWeek = new SimpleDateFormat("EEEE", Locale.ENGLISH).format(searchDate).toUpperCase();
        
        if (dayOfWeek.equals(doctor.getDayOff())) {
            availability.put("MORNING", false);
            availability.put("AFTERNOON", false);
            return availability;
        }

        long morningCount = appointmentRepository.countAvailable(doctorId, searchDate, "MORNING", excludeAppointmentId);
        availability.put("MORNING", morningCount < doctor.getMorningCapacity());

        long afternoonCount = appointmentRepository.countAvailable(doctorId, searchDate, "AFTERNOON", excludeAppointmentId);
        availability.put("AFTERNOON", afternoonCount < doctor.getAfternoonCapacity());

        return availability;
    }

    @Override
    public Map<String, Boolean> checkAvailabilityByUsername(String username, Date date, Long excludeAppointmentId) {
        Doctor doctor = doctorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + username));
        return checkAvailability(doctor.getId(), date, excludeAppointmentId);
    }

    @Override
    public Map<String, Object> getDoctorStats(String username) {
        Map<String, Object> stats = new HashMap<>();
        // Real counts from DB using Enum
        long totalAppts = appointmentRepository.countByDoctorUsername(username);
        long pendingAppts = appointmentRepository.countByDoctorUsernameAndStatus(username, AppointmentStatus.PENDING);
        long completedAppts = appointmentRepository.countByDoctorUsernameAndStatus(username, AppointmentStatus.DONE);
        long uniquePatients = appointmentRepository.countUniquePatientsByDoctor(username);
        
        stats.put("totalAppointments", totalAppts);
        stats.put("pendingAppointments", pendingAppts);
        stats.put("completedConsultations", completedAppts);
        stats.put("totalPatients", uniquePatients);
        stats.put("recentActivities", appointmentRepository.findTop5ByDoctorUsernameOrderByDateDesc(username));
        
        return stats;
    }

    @Override
    public Map<String, Object> getPatientStats(String username) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppointments", appointmentRepository.countByPatientUsername(username));
        stats.put("pendingAppointments", appointmentRepository.countByPatientUsernameAndStatus(username, AppointmentStatus.PENDING));
        stats.put("totalRecords", consultationRepository.countByAppointmentPatientUsername(username));
        return stats;
    }
}
