# Hospital Management System Backend API

This project is the Spring Boot REST API for the Hospital Management System. It replaces the old Thymeleaf-based MVC application.

## Technologies Used
- Java 8
- Spring Boot 2.6.6
- Spring Data JPA
- Spring Security
- MySQL Database

## API Endpoints

| Resource      | Endpoint                                 | Methods               |
| ------------- | ---------------------------------------- | --------------------- |
| Patients      | `/api/patients`                          | GET, POST, PUT, DELETE|
| Médecins      | `/api/medecins`                          | GET, POST, PUT, DELETE|
| Consultations | `/api/consultations`                     | GET, POST, PUT, DELETE|
| Rendez-vous   | `/api/rendezvous`                        | GET, POST, PUT, DELETE|

## Security Configuration
- CSRF is disabled since it's a stateless REST API via frontend.
- `CorsConfig` allows connections from `http://localhost:4200` globally.
- Form login has been removed completely to serve raw JSON.

## Setup Instructions
1. Ensure a MySQL database named `PATIENT` is running on port 3302.
2. Run `./mvnw spring-boot:run` to start the backend on port `8086`.

Alternatively, use the `docker-compose.yml` in the root directory.
