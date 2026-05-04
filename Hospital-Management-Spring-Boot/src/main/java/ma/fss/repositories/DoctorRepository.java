package ma.fss.repositories;

import ma.fss.entities.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Page<Doctor> findByNameContains(String keyword, Pageable pageable);
    Page<Doctor> findByHospitalIdAndNameContains(Long hospitalId, String keyword, Pageable pageable);
    long countByHospitalId(Long hospitalId);
}
