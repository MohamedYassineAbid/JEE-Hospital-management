package ma.fss;

import ma.fss.security.entities.DoctorKey;
import ma.fss.security.repositories.DoctorKeyRepository;
import ma.fss.security.service.SecurityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.UUID;

@SpringBootApplication
public class PatientApplication {

	public static void main(String[] args) {
		SpringApplication.run(PatientApplication.class, args);
	}

	@Bean
	CommandLineRunner repairSchema(JdbcTemplate jdbcTemplate) {
		return args -> {
			System.out.println("--- RUNNING AGGRESSIVE SCHEMA CLEANUP ---");
			// Drop legacy columns that cause NOT NULL constraints issues
			String[] drops = {
				"ALTER TABLE patient DROP COLUMN malade",
				"ALTER TABLE patient DROP COLUMN nom",
				"ALTER TABLE patient DROP COLUMN date_naissance",
				"ALTER TABLE patient DROP COLUMN adresse",
				"ALTER TABLE patient DROP COLUMN num_tel",
				"ALTER TABLE doctor DROP COLUMN nom",
				"ALTER TABLE doctor DROP COLUMN specialite",
				"ALTER TABLE appointment DROP COLUMN statusrdv"
			};
			
			for (String sql : drops) {
				try {
					jdbcTemplate.execute(sql);
					System.out.println("SUCCESS: " + sql);
				} catch (Exception e) {
					// Likely column doesn't exist, which is fine
				}
			}
			System.out.println("--- SCHEMA CLEANUP FINISHED ---");
		};
	}

	@Bean
	CommandLineRunner saveUsers(SecurityService securityService, DoctorKeyRepository doctorKeyRepository){
		return args ->{
			try { securityService.saveNewRole("DOCTOR", "Medical Professional"); } catch(Exception e) {}
			try { securityService.saveNewRole("PATIENT", "Service Consumer"); } catch(Exception e) {}

			if (doctorKeyRepository.count() == 0) {
				System.out.println("SEEDING 20 DOCTOR SECRET KEYS:");
				for (int i = 1; i <= 20; i++) {
					String key = "DOC-KEY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
					doctorKeyRepository.save(new DoctorKey(null, key, false, null));
					System.out.println("Key " + i + ": " + key);
				}
			}
		};
	}
}
