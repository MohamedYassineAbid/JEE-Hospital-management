import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-page">
      <nav class="navbar navbar-expand-lg navbar-dark transparent-nav p-4 fixed-top">
        <div class="container">
          <a class="navbar-brand fw-bold fs-3" href="#"><i class="bi bi-hospital-fill me-2"></i>MediCore</a>
          <div class="ms-auto">
            <a routerLink="/login" class="btn btn-outline-light rounded-pill px-4 me-2">Sign In</a>
            <a routerLink="/login" class="btn btn-light rounded-pill px-4 text-primary fw-bold">Get Started</a>
          </div>
        </div>
      </nav>

      <section class="hero-section text-white d-flex align-items-center">
        <div class="container text-center">
          <div class="badge rounded-pill bg-white bg-opacity-10 text-white mb-4 px-3 py-2 border border-white border-opacity-25 fade-in">
            Next-Gen Hospital Management
          </div>
          <h1 class="display-1 fw-bold mb-4 fade-in-delayed">Revolutionizing Healthcare Operations</h1>
          <p class="lead mb-5 opacity-75 mx-auto fade-in-delayed-2" style="max-width: 700px;">
            A complete, integrated platform for hospitals and clinics to manage patients, doctors, and consultations with unparalleled ease and security.
          </p>
          <div class="d-flex justify-content-center gap-3 fade-in-delayed-3">
            <a routerLink="/login" class="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg">Start Free Trial</a>
            <button class="btn btn-outline-light btn-lg rounded-pill px-5 py-3">Watch Demo</button>
          </div>
        </div>
        
        <!-- Abstract Background Shapes -->
        <div class="abstract-shape shape-1"></div>
        <div class="abstract-shape shape-2"></div>
      </section>

      <section class="features-section py-5 bg-white">
        <div class="container py-5">
          <div class="text-center mb-5">
            <h2 class="fw-bold display-5">Why Choose MediCore?</h2>
            <p class="text-muted">Built by medical professionals, for medical professionals.</p>
          </div>
          <div class="row g-4">
            <div class="col-md-4" *ngFor="let f of features">
              <div class="card h-100 border-0 shadow-sm p-4 text-center hover-up">
                <div class="feature-icon mb-4">
                  <i [class]="'bi ' + f.icon + ' display-5 text-primary'"></i>
                </div>
                <h4 class="fw-bold">{{f.title}}</h4>
                <p class="text-muted">{{f.desc}}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page { overflow-x: hidden; }
    .hero-section {
      height: 100vh;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      position: relative;
      overflow: hidden;
    }
    .transparent-nav { z-index: 1000; }
    .abstract-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.3;
    }
    .shape-1 { width: 500px; height: 500px; background: #667eea; top: -100px; right: -100px; }
    .shape-2 { width: 400px; height: 400px; background: #764ba2; bottom: -50px; left: -50px; }
    
    .fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .fade-in-delayed { animation: fadeIn 0.8s ease-out 0.2s forwards; opacity: 0; }
    .fade-in-delayed-2 { animation: fadeIn 0.8s ease-out 0.4s forwards; opacity: 0; }
    .fade-in-delayed-3 { animation: fadeIn 0.8s ease-out 0.6s forwards; opacity: 0; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .hover-up:hover { transform: translateY(-10px); transition: 0.3s; }
  `]
})
export class HomeComponent {
  features = [
    { title: 'Patient Centric', desc: 'Comprehensive electronic health records accessible instantly.', icon: 'bi-person-heart' },
    { title: 'Smart Scheduling', desc: 'AI-powered appointment scheduling to minimize wait times.', icon: 'bi-calendar-check' },
    { title: 'Secure & Private', desc: 'End-to-end encryption for all medical and personal data.', icon: 'bi-shield-lock' }
  ];
}
