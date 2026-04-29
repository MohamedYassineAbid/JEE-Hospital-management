package ma.fss.repositories;

import ma.fss.entities.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
}
