package ma.fss.repositories;

import ma.fss.entities.Medecin;
import net.bytebuddy.implementation.bytecode.ShiftRight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface MedecinRepository extends JpaRepository<Medecin, Long> {

    Page<Medecin> findByNomContains(String nom, Pageable pageable);

}
