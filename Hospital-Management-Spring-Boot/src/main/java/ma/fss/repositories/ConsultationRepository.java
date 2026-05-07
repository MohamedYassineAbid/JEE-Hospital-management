package ma.fss.repositories;

import ma.fss.entities.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findByAppointmentDoctorUsername(String username, Pageable pageable);
    Page<Consultation> findByAppointmentPatientUsername(String username, Pageable pageable);
    long countByAppointmentPatientUsername(String username);
}
