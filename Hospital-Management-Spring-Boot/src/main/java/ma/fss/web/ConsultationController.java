package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Consultation;
import ma.fss.repositories.ConsultationRepository;
import ma.fss.service.IHospitalService;
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
    private IHospitalService hospitalService;

    @GetMapping
    public Page<Consultation> getConsultations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            java.security.Principal principal) {
        
        String username = principal.getName();
        Page<Consultation> doctorRecords = consultationRepository.findByAppointmentDoctorUsername(username, PageRequest.of(page, size));
        if (doctorRecords.getTotalElements() > 0) return doctorRecords;

        return consultationRepository.findByAppointmentPatientUsername(username, PageRequest.of(page, size));
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
        return hospitalService.saveConsultation(consultation);
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
