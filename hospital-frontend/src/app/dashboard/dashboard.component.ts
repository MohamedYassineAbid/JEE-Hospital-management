import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid fade-in">
      <div class="row g-4 mb-5">
        <div class="col-md-3" *ngFor="let card of statCards">
          <div class="card border-0 h-100 overflow-hidden">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div [class]="'bg-opacity-10 p-3 rounded-4 ' + card.bgClass">
                  <i [class]="'bi ' + card.icon + ' fs-3 ' + card.textClass"></i>
                </div>
                <span class="badge rounded-pill bg-light text-dark border">+12%</span>
              </div>
              <h6 class="text-muted text-uppercase small fw-bold tracking-wider mb-1">{{card.title}}</h6>
              <h2 class="display-6 fw-bold mb-0">{{card.value}}</h2>
            </div>
            <div class="px-4 pb-4 mt-auto">
               <div class="progress" style="height: 6px;">
                  <div [class]="'progress-bar ' + card.progressClass" role="progressbar" [style.width]="'70%'"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-8">
          <div class="card border-0 mb-4">
            <div class="card-header bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">System Performance</h5>
              <button class="btn btn-sm btn-light border">Export Data</button>
            </div>
            <div class="card-body p-4 pt-0">
              <div class="welcome-banner p-5 rounded-5 text-white mb-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div class="row align-items-center">
                  <div class="col-md-7">
                    <h2 class="fw-bold mb-3">Ready to optimize hospital flow?</h2>
                    <p class="opacity-75 mb-4">You have 5 new appointment requests and 2 pending doctor validations today. Check the alerts to stay updated.</p>
                    <button class="btn btn-white text-primary fw-bold px-4 rounded-pill">Take Action</button>
                  </div>
                  <div class="col-md-5 text-center d-none d-md-block">
                    <i class="bi bi-rocket-takeoff display-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card border-0">
            <div class="card-header bg-transparent border-0 p-4">
              <h5 class="fw-bold mb-0">Notifications</h5>
            </div>
            <div class="card-body p-4 pt-0">
              <div class="d-flex gap-3 mb-4" *ngFor="let note of notifications">
                <div [class]="'rounded-circle p-2 d-flex align-items-center justify-content-center bg-opacity-10 ' + note.bg" style="width: 40px; height: 40px;">
                  <i [class]="'bi ' + note.icon + ' ' + note.text"></i>
                </div>
                <div>
                  <h6 class="small fw-bold mb-1">{{note.title}}</h6>
                  <p class="text-muted tiny mb-0">{{note.time}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-wider { letter-spacing: 0.1em; }
    .tiny { font-size: 0.75rem; }
    .bg-opacity-10 { background-color: rgba(var(--bs-primary-rgb), 0.1); }
    .bg-primary-light { background-color: rgba(102, 126, 234, 0.1); }
    .btn-white { background: white; border: none; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalConsultations: 0
  };

  statCards: any[] = [];
  notifications = [
    { title: 'New Patient Registered', time: '2 mins ago', icon: 'bi-person-plus', bg: 'bg-primary', text: 'text-primary' },
    { title: 'Dr. Smith completed consultation', time: '1 hour ago', icon: 'bi-check2-circle', bg: 'bg-success', text: 'text-success' },
    { title: 'Server backup successful', time: '3 hours ago', icon: 'bi-cloud-check', bg: 'bg-info', text: 'text-info' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStats().subscribe(res => {
      this.stats = res;
      this.updateCards();
    });
  }

  updateCards() {
    this.statCards = [
      { title: 'Patients', value: this.stats.totalPatients, icon: 'bi-people-fill', bgClass: 'bg-primary', textClass: 'text-primary', progressClass: 'bg-primary' },
      { title: 'Doctors', value: this.stats.totalDoctors, icon: 'bi-person-badge-fill', bgClass: 'bg-success', textClass: 'text-success', progressClass: 'bg-success' },
      { title: 'Appointments', value: this.stats.totalAppointments, icon: 'bi-calendar-check', bgClass: 'bg-warning', textClass: 'text-warning', progressClass: 'bg-warning' },
      { title: 'Consultations', value: this.stats.totalConsultations, icon: 'bi-clipboard-pulse', bgClass: 'bg-danger', textClass: 'text-danger', progressClass: 'bg-danger' }
    ];
  }
}
