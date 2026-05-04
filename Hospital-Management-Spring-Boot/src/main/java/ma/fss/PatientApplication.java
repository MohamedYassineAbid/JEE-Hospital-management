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
	CommandLineRunner saveUsers(SecurityService securityService){
		return args ->{
			// Create roles (skip if already exist)
			try { securityService.saveNewRole("ADMIN", "Administrator"); } catch(Exception e) {}
			try { securityService.saveNewRole("DOCTOR", "Doctor"); } catch(Exception e) {}
			try { securityService.saveNewRole("PATIENT", "Patient"); } catch(Exception e) {}

			// Create users (skip if already exist)
			try { securityService.saveNewUser("admin", "admin123", "admin123"); } catch(Exception e) {}
			try { securityService.saveNewUser("doctor", "doctor123", "doctor123"); } catch(Exception e) {}
			try { securityService.saveNewUser("patient", "patient123", "patient123"); } catch(Exception e) {}

			// Assign roles (skip if already assigned)
			try { securityService.addRoleToUser("admin", "ADMIN"); } catch(Exception e) {}
			try { securityService.addRoleToUser("doctor", "DOCTOR"); } catch(Exception e) {}
			try { securityService.addRoleToUser("patient", "PATIENT"); } catch(Exception e) {}
		};
	}
}
