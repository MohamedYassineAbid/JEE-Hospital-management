import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="login-container d-flex align-items-center justify-content-center">
      <div class="glass-login shadow-lg p-5 rounded-5 animate-slide-up">
        <div class="text-center mb-5">
           <a routerLink="/" class="text-decoration-none">
             <h2 class="fw-bold text-white mb-2"><i class="bi bi-hospital-fill me-2"></i>MediCore</h2>
           </a>
           <p class="text-white opacity-75">Sign in to your account</p>
        </div>
        
        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-white small p-3 rounded-4 mb-4">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="mb-4">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-white bg-opacity-10 border-0 text-white"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control bg-white bg-opacity-10 border-0 text-white" placeholder="Email Address" [(ngModel)]="credentials.email" name="email" required>
            </div>
          </div>
          <div class="mb-4">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-white bg-opacity-10 border-0 text-white"><i class="bi bi-lock"></i></span>
              <input type="password" class="form-control bg-white bg-opacity-10 border-0 text-white" placeholder="Password" [(ngModel)]="credentials.password" name="password" required>
            </div>
          </div>
          
          <button type="submit" class="btn btn-light btn-lg w-100 rounded-pill fw-bold text-primary py-3 mb-4" [disabled]="loading">
             <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
             {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
          
          <div class="text-center">
            <p class="text-white opacity-75 small mb-0">Don't have an account? <a routerLink="/register" class="text-white fw-bold">Sign Up</a></p>
          </div>

          <!-- Demo Credentials -->
          <div class="mt-4 pt-3 border-top border-white border-opacity-10">
            <p class="text-white opacity-50 small text-center mb-2">Demo Credentials</p>
            <div class="d-flex gap-2 justify-content-center flex-wrap">
              <button type="button" class="btn btn-sm btn-outline-light rounded-pill px-3 opacity-75" (click)="fillDemo('admin@medicore.com')">Admin</button>
              <button type="button" class="btn btn-sm btn-outline-light rounded-pill px-3 opacity-75" (click)="fillDemo('doctor1@medicore.com')">Doctor</button>
              <button type="button" class="btn btn-sm btn-outline-light rounded-pill px-3 opacity-75" (click)="fillDemo('patient1@medicore.com')">Patient</button>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Background Circles -->
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      background: #0f172a;
      position: relative;
      overflow: hidden;
    }
    .glass-login {
      width: 480px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 10;
    }
    .form-control::placeholder { color: rgba(255,255,255,0.4); }
    .form-control:focus { background: rgba(255,255,255,0.15); box-shadow: none; color: white; }
    
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      z-index: 1;
    }
    .circle-1 { width: 600px; height: 600px; background: radial-gradient(#3b82f6, transparent); top: -200px; left: -200px; opacity: 0.4; }
    .circle-2 { width: 500px; height: 500px; background: radial-gradient(#8b5cf6, transparent); bottom: -150px; right: -150px; opacity: 0.4; }
    
    .animate-slide-up {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  fillDemo(email: string) {
    this.credentials.email = email;
    this.credentials.password = '1234';
    this.errorMessage = '';
  }

  onLogin() {
    if (!this.credentials.email || !this.credentials.password) return;
    
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Unable to connect to the server. Please try again.';
        }
      }
    });
  }
}
