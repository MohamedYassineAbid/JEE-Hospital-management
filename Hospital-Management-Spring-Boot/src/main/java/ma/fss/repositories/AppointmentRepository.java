package ma.fss.repositories;

import ma.fss.entities.Appointment;
import ma.fss.entities.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Page<Appointment> findByPatientUsername(String username, Pageable pageable);
    Page<Appointment> findByDoctorUsername(String username, Pageable pageable);
    
    long countByDoctorIdAndDateAndSession(Long doctorId, Date date, String session);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.date = :date AND a.session = :session AND (:excludeId IS NULL OR a.id <> :excludeId)")
    long countAvailable(@Param("doctorId") Long doctorId, @Param("date") Date date, @Param("session") String session, @Param("excludeId") Long excludeId);

    List<Appointment> findByDoctorIdAndDate(Long doctorId, Date date);

    long countByDoctorUsername(String username);
    long countByDoctorUsernameAndStatus(String username, AppointmentStatus status);
    long countByPatientUsername(String username);
    long countByPatientUsernameAndStatus(String username, AppointmentStatus status);
    
    // For Recent Activity
    List<Appointment> findTop5ByDoctorUsernameOrderByDateDesc(String username);

    @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a WHERE a.doctor.username = :username")
    long countUniquePatientsByDoctor(@Param("username") String username);
}
