package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.repositories.AppointmentRepository;
import ma.fss.repositories.ConsultationRepository;
import ma.fss.repositories.DoctorRepository;
import ma.fss.repositories.PatientRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/stats")
public class StatsController {
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    @GetMapping("/summary")
    public Map<String, Long> getSummaryStats(@RequestParam(name = "hospitalId", required = false) Long hospitalId) {
        Map<String, Long> stats = new HashMap<>();
        
        if (hospitalId != null) {
            stats.put("totalPatients", patientRepository.countByHospitalId(hospitalId));
            stats.put("totalDoctors", doctorRepository.countByHospitalId(hospitalId));
            stats.put("totalAppointments", appointmentRepository.countByHospitalId(hospitalId));
            stats.put("totalConsultations", consultationRepository.countByHospitalId(hospitalId));
        } else {
            stats.put("totalPatients", patientRepository.count());
            stats.put("totalDoctors", doctorRepository.count());
            stats.put("totalAppointments", appointmentRepository.count());
            stats.put("totalConsultations", consultationRepository.count());
        }
        
        return stats;
    }
}
