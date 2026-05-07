import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  stats: any = {
    totalAppointments: 0,
    pendingAppointments: 0,
    completedConsultations: 0,
    totalRecords: 0,
    totalPatients: 0
  };
  
  recentActivities: any[] = [];
  username = '';
  role = '';

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername() || 'Guest';
    this.role = this.auth.getRole();
    this.loadRealStats();
  }

  loadRealStats(): void {
    if (this.role === 'DOCTOR') {
      this.api.getDoctorStats(this.username).subscribe(data => {
        this.stats = data;
        this.recentActivities = data.recentActivities || [];
      });
    } else if (this.role === 'PATIENT') {
      this.api.getPatientStats(this.username).subscribe(data => {
        this.stats = data;
      });
    }
  }

  getActivityIcon(status: string): string {
    switch (status) {
      case 'DONE': return 'bi-check-circle-fill text-success';
      case 'PENDING': return 'bi-clock-fill text-warning';
      case 'CANCELED': return 'bi-x-circle-fill text-danger';
      default: return 'bi-info-circle-fill text-primary';
    }
  }
}
