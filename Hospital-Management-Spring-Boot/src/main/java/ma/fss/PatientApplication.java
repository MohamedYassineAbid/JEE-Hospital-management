package ma.fss;

import ma.fss.security.service.SecurityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PatientApplication {

	public static void main(String[] args) {
		SpringApplication.run(PatientApplication.class, args);
	}

	@Bean
	CommandLineRunner start(SecurityService securityService, ma.fss.repositories.HospitalRepository hospitalRepository, ma.fss.repositories.DoctorRepository doctorRepository, ma.fss.repositories.PatientRepository patientRepository) {
		return args -> {
			// Seed Hospital
			ma.fss.entities.Hospital initialHospital = new ma.fss.entities.Hospital();
			initialHospital.setName("MediCore Central Hospital");
			initialHospital.setAddress("123 Healthcare Ave, London");
			initialHospital.setContactNumber("+44 20 7946 0958");
			final ma.fss.entities.Hospital hospital = hospitalRepository.save(initialHospital);

			// Seed Users
			securityService.saveNewUser("admin@medicore.com", "1234", "1234", ma.fss.security.entities.UserType.ADMIN, hospital.getId());
			securityService.saveNewUser("doctor1@medicore.com", "1234", "1234", ma.fss.security.entities.UserType.DOCTOR, 1L);
			securityService.saveNewUser("patient1@medicore.com", "1234", "1234", ma.fss.security.entities.UserType.PATIENT, 1L);

			securityService.saveNewRole("ADMIN", "Administrator Role");
			securityService.saveNewRole("DOCTOR", "Doctor Role");
			securityService.saveNewRole("PATIENT", "Patient Role");

			securityService.addRoleToUserByEmail("admin@medicore.com", "ADMIN");
			securityService.addRoleToUserByEmail("doctor1@medicore.com", "DOCTOR");
			securityService.addRoleToUserByEmail("patient1@medicore.com", "PATIENT");

			// Seed Doctor
			ma.fss.entities.Doctor doctor = new ma.fss.entities.Doctor();
			doctor.setName("Dr. Sarah Wilson");
			doctor.setEmail("sarah.wilson@medicore.com");
			doctor.setSpecialty("Cardiology");
			doctor.setHospital(hospital);
			doctorRepository.save(doctor);

			// Seed Patients
			java.util.stream.Stream.of("John Doe", "Jane Smith", "Robert Brown").forEach(name -> {
				ma.fss.entities.Patient patient = new ma.fss.entities.Patient();
				patient.setName(name);
				patient.setBirthDate(new java.util.Date());
				patient.setSick(Math.random() > 0.5);
				patient.setHospital(hospital);
				patientRepository.save(patient);
			});
		};
	}
}
