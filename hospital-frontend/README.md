# Hospital Management System Frontend 

A modern Angular 17 interface designed to interact with the Spring Boot Backend for complete Hospital Management.

## Technologies Used
- Angular 17 (Standalone Components)
- Bootstrap 5 for UI/UX
- ReactiveFormsModule for input processing

## Features
- **Dashboard:** Interactive overview of complete hospital capacity.
- **Patients Management:** Seamless Paginated patient CRUD interface.
- **Doctors Management:** CRUD operations for team building.
- **Rendezvous & Consultations:** Tracking schedule and reports dynamically.

## Run Locally
1. Run `npm install` inside this directory to install modules.
2. Run `ng serve` (or `npm start`) to spin up the local dev server.
3. Access it at `http://localhost:4200`.

## Architecture Details
- Data handled via `ApiService` interacting globally with `http://localhost:8086`.
- Sidebar components orchestrated inside `AppComponent` layout.
