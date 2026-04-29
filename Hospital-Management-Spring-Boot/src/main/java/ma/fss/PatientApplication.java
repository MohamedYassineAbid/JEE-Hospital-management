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

	//@Bean
	CommandLineRunner saveUsers(SecurityService securityService){
		return args ->{
			securityService.saveNewUser("testuser1","1234","1234");
			securityService.saveNewUser("testuser2","1234","1234");

			securityService.saveNewRole("USER","");
			securityService.saveNewRole("ADMIN","");

			securityService.addRoleToUser("testuser1","USER");
			securityService.addRoleToUser("testuser2","USER");
		};
	}
}
