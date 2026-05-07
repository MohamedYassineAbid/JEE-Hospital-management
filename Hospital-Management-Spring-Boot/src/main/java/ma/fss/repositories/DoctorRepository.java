package ma.fss.repositories;

import ma.fss.entities.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Page<Doctor> findByNameContains(String keyword, Pageable pageable);
    Optional<Doctor> findByUsername(String username);
}
