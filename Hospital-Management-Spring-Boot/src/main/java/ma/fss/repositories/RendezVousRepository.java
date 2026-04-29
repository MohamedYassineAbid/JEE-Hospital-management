package ma.fss.repositories;

import ma.fss.entities.RendezVous;
import ma.fss.entities.StatusRDV;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Transactional
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    Page<RendezVous> findByDate(Date date, Pageable pageable);
}

