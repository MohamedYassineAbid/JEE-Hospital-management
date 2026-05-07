package ma.fss.security.repositories;

import ma.fss.security.entities.DoctorKey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorKeyRepository extends JpaRepository<DoctorKey, Long> {
    Optional<DoctorKey> findBySecretKey(String secretKey);
}
