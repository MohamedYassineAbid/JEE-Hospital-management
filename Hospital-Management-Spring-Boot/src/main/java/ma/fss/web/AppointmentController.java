package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Appointment;
import ma.fss.repositories.AppointmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public Page<Appointment> getAppointments(
            @RequestParam(name = "hospitalId", required = false) Long hospitalId,
            @RequestParam(name = "patientId", required = false) Long patientId,
            @RequestParam(name = "doctorId", required = false) Long doctorId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        
        if (hospitalId != null) {
            return appointmentRepository.findByHospitalId(hospitalId, PageRequest.of(page, size));
        }
        if (patientId != null) {
            return appointmentRepository.findByPatientId(patientId, PageRequest.of(page, size));
        }
        if (doctorId != null) {
            return appointmentRepository.findByDoctorId(doctorId, PageRequest.of(page, size));
        }
        return appointmentRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Appointment createAppointment(@Valid @RequestBody Appointment appointment) {
        appointment.setId(null);
        return appointmentRepository.save(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @Valid @RequestBody Appointment appointment) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appointment.setId(id);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
