package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Consultation;
import ma.fss.repositories.ConsultationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
@RequestMapping("/api/consultations")
public class ConsultationController {
    private ConsultationRepository consultationRepository;

    @GetMapping
    public Page<Consultation> getConsultations(
            @RequestParam(name = "hospitalId", required = false) Long hospitalId,
            @RequestParam(name = "patientId", required = false) Long patientId,
            @RequestParam(name = "doctorId", required = false) Long doctorId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        
        if (hospitalId != null) {
            return consultationRepository.findByHospitalId(hospitalId, PageRequest.of(page, size));
        }
        if (patientId != null) {
            return consultationRepository.findByAppointmentPatientId(patientId, PageRequest.of(page, size));
        }
        if (doctorId != null) {
            return consultationRepository.findByAppointmentDoctorId(doctorId, PageRequest.of(page, size));
        }
        return consultationRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable Long id) {
        return consultationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Consultation createConsultation(@Valid @RequestBody Consultation consultation) {
        consultation.setId(null);
        return consultationRepository.save(consultation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id, @Valid @RequestBody Consultation consultation) {
        if (!consultationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        consultation.setId(id);
        return ResponseEntity.ok(consultationRepository.save(consultation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        if (!consultationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        consultationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
