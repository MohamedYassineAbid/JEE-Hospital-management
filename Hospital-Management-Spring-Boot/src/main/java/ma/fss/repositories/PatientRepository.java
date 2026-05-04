package ma.fss.repositories;

import ma.fss.entities.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Page<Patient> findByNameContains(String keyword, Pageable pageable);
    Page<Patient> findByHospitalIdAndNameContains(Long hospitalId, String keyword, Pageable pageable);
    long countByHospitalId(Long hospitalId);
}
