package ma.fss.repositories;

import ma.fss.entities.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient,Long> {
    Page<Patient> findByNameContains(String keyword, Pageable pageable);
    Optional<Patient> findByUsername(String username);
    Patient findByCin(String cin);
}
