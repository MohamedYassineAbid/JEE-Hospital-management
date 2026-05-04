package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Doctor;
import ma.fss.repositories.DoctorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
@RequestMapping("/api/doctors")
public class DoctorController {
    private DoctorRepository doctorRepository;

    @GetMapping
    public Page<Doctor> getDoctors(
            @RequestParam(name = "hospitalId", required = false) Long hospitalId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "keyword", defaultValue = "") String keyword) {
        
        if (hospitalId != null) {
            return doctorRepository.findByHospitalIdAndNameContains(hospitalId, keyword, PageRequest.of(page, size));
        }
        return doctorRepository.findByNameContains(keyword, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Doctor createDoctor(@Valid @RequestBody Doctor doctor) {
        doctor.setId(null);
        return doctorRepository.save(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @Valid @RequestBody Doctor doctor) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctor.setId(id);
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
