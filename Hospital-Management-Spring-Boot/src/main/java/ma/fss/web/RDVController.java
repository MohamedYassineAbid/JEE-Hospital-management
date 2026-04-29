package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.RendezVous;
import ma.fss.repositories.RendezVousRepository;
import ma.fss.service.IHopitalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
@RequestMapping("/api/rendezvous")
public class RDVController {
    private RendezVousRepository rendezVousRepository;
    private IHopitalService hopitalService;

    @GetMapping
    public Page<RendezVous> getRendezVous(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        return rendezVousRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> getRendezVousById(@PathVariable Long id) {
        return rendezVousRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RendezVous createRendezVous(@Valid @RequestBody RendezVous rendezVous) {
        rendezVous.setId(null);
        return hopitalService.saveRendezVous(rendezVous);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(@PathVariable Long id, @Valid @RequestBody RendezVous rendezVous) {
        if (!rendezVousRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rendezVous.setId(id);
        return ResponseEntity.ok(rendezVousRepository.save(rendezVous));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        if (!rendezVousRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rendezVousRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
