import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <h2 class="mb-4"><i class="bi bi-speedometer2 text-primary"></i> Dashboard</h2>
      
      <div class="row g-4">
        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm bg-gradient-primary text-body" style="border-left: 5px solid #0d6efd !important;">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2 text-uppercase">Total Patients</h6>
                <h2 class="mb-0 fw-bold">{{patientCount}}</h2>
              </div>
              <div class="fs-1 text-primary opacity-50"><i class="bi bi-people-fill"></i></div>
            </div>
            <div class="card-footer bg-white border-0 py-3">
              <a routerLink="/patients" class="text-decoration-none text-primary">Voir tous les patients <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm text-body" style="border-left: 5px solid #198754 !important;">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2 text-uppercase">Médecins</h6>
                <h2 class="mb-0 fw-bold">{{medecinCount}}</h2>
              </div>
              <div class="fs-1 text-success opacity-50"><i class="bi bi-file-medical"></i></div>
            </div>
            <div class="card-footer bg-white border-0 py-3">
              <a routerLink="/medecins" class="text-decoration-none text-success">Gérer l'équipe <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm text-body" style="border-left: 5px solid #ffc107 !important;">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2 text-uppercase">Rendez-vous</h6>
                <h2 class="mb-0 fw-bold">{{rdvCount}}</h2>
              </div>
              <div class="fs-1 text-warning opacity-50"><i class="bi bi-calendar-check pe-none"></i></div>
            </div>
            <div class="card-footer bg-white border-0 py-3">
              <a routerLink="/rendezvous" class="text-decoration-none text-warning">Agenda <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm text-body" style="border-left: 5px solid #dc3545 !important;">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2 text-uppercase">Consultations</h6>
                <h2 class="mb-0 fw-bold">{{consultationCount}}</h2>
              </div>
              <div class="fs-1 text-danger opacity-50"><i class="bi bi-clipboard2-pulse"></i></div>
            </div>
            <div class="card-footer bg-white border-0 py-3">
              <a routerLink="/consultations" class="text-decoration-none text-danger">Dossiers <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-5">
        <div class="col-md-12">
            <div class="card shadow-sm border-0">
                <div class="card-body py-5 text-center fade-in">
                    <img src="assets/hospital-welcome.svg" alt="Welcome" class="img-fluid mb-4 opacity-50" style="max-height: 200px" onerror="this.style.display='none'">
                    <h2>Bienvenue dans le système de gestion</h2>
                    <p class="text-muted mx-auto" style="max-width: 600px;">Sélectionnez un élément dans le menu latéral pour commencer à gérer votre hôpital complet en toute simplicité et rapidité grâce à cette nouvelle interface moderne.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  patientCount = 0;
  medecinCount = 0;
  rdvCount = 0;
  consultationCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPatients(0, 1).subscribe(res => this.patientCount = res.totalElements);
    this.api.getMedecins(0, 1).subscribe(res => this.medecinCount = res.totalElements);
    this.api.getRendezVous(0, 1).subscribe(res => this.rdvCount = res.totalElements);
    this.api.getConsultations(0, 1).subscribe(res => this.consultationCount = res.totalElements);
  }
}
