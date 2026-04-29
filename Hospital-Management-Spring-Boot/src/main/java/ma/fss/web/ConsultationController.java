package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Consultation;
import ma.fss.repositories.ConsultationRepository;
import ma.fss.service.IHopitalService;
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
    private IHopitalService hopitalService;

    @GetMapping
    public Page<Consultation> getConsultations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
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
        return hopitalService.saveConsultation(consultation);
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
