package ma.fss.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hospital Management System API")
                        .version("1.0.0")
                        .description("Comprehensive API for managing patients, doctors, appointments, and consultations.")
                        .contact(new Contact()
                                .name("Ahmed Bensalah")
                                .email("contact@hospital-ms.com")));
    }
}
