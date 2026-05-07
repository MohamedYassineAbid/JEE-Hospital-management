package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Appointment;
import ma.fss.entities.AppointmentStatus;
import ma.fss.repositories.AppointmentRepository;
import ma.fss.service.IHospitalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {
    private AppointmentRepository appointmentRepository;
    private IHospitalService hospitalService;

    @GetMapping
    public Page<Appointment> getAppointments(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            java.security.Principal principal) {
        
        String username = principal.getName();
        Page<Appointment> doctorAppts = appointmentRepository.findByDoctorUsername(username, PageRequest.of(page, size));
        if (doctorAppts.getTotalElements() > 0) return doctorAppts;
        
        return appointmentRepository.findByPatientUsername(username, PageRequest.of(page, size));
    }

    @GetMapping("/availability")
    public Map<String, Boolean> checkAvailability(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long excludeId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        if (username != null) {
            return hospitalService.checkAvailabilityByUsername(username, date, excludeId);
        }
        return hospitalService.checkAvailability(doctorId, date, excludeId);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@Valid @RequestBody Appointment appointment) {
        try {
            appointment.setId(null);
            appointment.setStatus(AppointmentStatus.PENDING);
            return ResponseEntity.ok(hospitalService.saveAppointment(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String report = body.get("report");
            return ResponseEntity.ok(hospitalService.completeAppointment(id, report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @Valid @RequestBody Appointment appointment) {
        try {
            if (!appointmentRepository.existsById(id)) return ResponseEntity.notFound().build();
            appointment.setId(id);
            return ResponseEntity.ok(hospitalService.saveAppointment(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) return ResponseEntity.notFound().build();
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
