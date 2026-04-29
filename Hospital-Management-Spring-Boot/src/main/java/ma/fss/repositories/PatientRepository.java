package ma.fss.repositories;

import ma.fss.entities.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
//patientDAO
//heriter d'une interface generique

public interface PatientRepository extends JpaRepository<Patient,Long> {

    Page<Patient> findByNomContains(String nom, Pageable pageable);

}
