import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  patientCount = 0;
  medecinCount = 0;
  rdvCount = 0;
  consultationCount = 0;

  constructor(private api: ApiService, public auth: AuthService) {}

  get role(): string {
    return this.auth.getRole();
  }

  get username(): string {
    return this.auth.getUsername();
  }

  ngOnInit(): void {
    // Load stats based on role
    if (this.role === 'ADMIN' || this.role === 'DOCTOR') {
      this.api.getPatients(0, 1).subscribe(res => this.patientCount = res.totalElements);
      this.api.getRendezVous(0, 1).subscribe(res => this.rdvCount = res.totalElements);
      this.api.getConsultations(0, 1).subscribe(res => this.consultationCount = res.totalElements);
    }
    if (this.role === 'ADMIN') {
      this.api.getMedecins(0, 1).subscribe(res => this.medecinCount = res.totalElements);
    }
    if (this.role === 'PATIENT') {
      this.api.getRendezVous(0, 1).subscribe(res => this.rdvCount = res.totalElements);
      this.api.getConsultations(0, 1).subscribe(res => this.consultationCount = res.totalElements);
    }
  }
}
