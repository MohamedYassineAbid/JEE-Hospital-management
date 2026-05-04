package ma.fss.repositories;

import ma.fss.entities.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findByHospitalId(Long hospitalId, Pageable pageable);
    Page<Consultation> findByAppointmentPatientId(Long patientId, Pageable pageable);
    Page<Consultation> findByAppointmentDoctorId(Long doctorId, Pageable pageable);
    long countByHospitalId(Long hospitalId);
}
