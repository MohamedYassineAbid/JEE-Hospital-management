# Hospital Management Platform - Healing Center

A modern, secure, and multi-tenant clinical management system built with Spring Boot (Backend) and Angular (Frontend).

## 🚀 Key Features
- **Role-Based Authentication**: Secure access for Admins, Doctors, and Patients via JWT.
- **Doctor Registration**: Verification-based signup using unique administrative secret keys.
- **Smart Scheduling**: Session-based appointment booking (Morning/Afternoon) with automatic capacity limits and day-off detection.
- **Medical Records**: Secure consultation tracking with history for both doctors and patients.
- **Secure Messaging**: Private follow-up discussion channel between doctors and their established patients.
- **Multi-Tenant Privacy**: Strict data isolation ensuring users only see information relevant to their clinical relationship.

## 🛠️ Technology Stack
### Backend
- **Framework**: Spring Boot 2.6.6
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL
- **Security**: Spring Security + Auth0 JWT
- **Build Tool**: Maven

### Frontend
- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: Vanilla CSS + Bootstrap 5 Icons
- **State Management**: RxJS Observables

## 📦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for frontend development)
- Java 8+ (for backend development)

### Deployment with Docker
1. Clone the repository:
   ```bash
   git clone https://github.com/MohamedYassineAbid/JEE-Hospital-management.git
   cd JEE-Hospital-management
   ```
2. Build and start the containers:
   ```bash
   docker-compose up --build -d
   ```
3. Access the application:
   - Frontend: `http://localhost:4200`
   - Backend API: `http://localhost:8086`

## 🏗️ Architecture
- **Entities**: Clean English-based schema (`Doctor`, `Patient`, `Appointment`, `Consultation`, `Message`).
- **Repositories**: Standardized JPA repositories with derived query methods for data isolation.
- **Security**: JWT-based stateless authentication with role-based authorization rules.
- **Frontend SPA**: Modular architecture with dedicated components for each clinical module.

## 🤝 Contribution
This project was fully rebranded and internationalized to English to ensure professional standards and global accessibility.

---
© 2026 Dar Ettabib — Healing Center. All Rights Reserved.
