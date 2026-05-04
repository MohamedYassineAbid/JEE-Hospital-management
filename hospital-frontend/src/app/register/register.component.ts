import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="login-container d-flex align-items-center justify-content-center">
      <div class="glass-login shadow-lg p-5 rounded-5 animate-slide-up">
        <div class="text-center mb-5">
           <a routerLink="/" class="text-decoration-none">
             <h2 class="fw-bold text-white mb-2"><i class="bi bi-person-plus-fill me-2"></i>Join MediCore</h2>
           </a>
           <p class="text-white opacity-75">Create your medical account today</p>
        </div>

        <!-- Error/Success Alert -->
        <div *ngIf="errorMessage" class="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-white small p-3 rounded-4 mb-3">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="alert alert-success bg-success bg-opacity-10 border-success border-opacity-25 text-white small p-3 rounded-4 mb-3">
          <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
        </div>
        
        <form (ngSubmit)="onRegister()">
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text bg-white bg-opacity-10 border-0 text-white"><i class="bi bi-person-circle"></i></span>
              <input type="text" class="form-control bg-white bg-opacity-10 border-0 text-white" placeholder="Full Name" [(ngModel)]="regData.fullName" name="fullName" required>
            </div>
          </div>

          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text bg-white bg-opacity-10 border-0 text-white"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control bg-white bg-opacity-10 border-0 text-white" placeholder="Email Address" [(ngModel)]="regData.email" name="email" required>
            </div>
          </div>

          <!-- Role Selection with Visual Cards -->
          <div class="mb-3">
            <p class="text-white opacity-50 small mb-2">I am registering as:</p>
            <div class="d-flex gap-2">
              <div class="role-card flex-fill text-center p-3 rounded-4" 
                   [class.active]="regData.userType === 'PATIENT'"
                   (click)="regData.userType = 'PATIENT'">
                <i class="bi bi-person-heart d-block fs-4 mb-1"></i>
                <span class="small fw-bold">Patient</span>
              </div>
              <div class="role-card flex-fill text-center p-3 rounded-4"
                   [class.active]="regData.userType === 'DOCTOR'"
                   (click)="regData.userType = 'DOCTOR'">
                <i class="bi bi-heart-pulse d-block fs-4 mb-1"></i>
                <span class="small fw-bold">Doctor</span>
              </div>
              <div class="role-card flex-fill text-center p-3 rounded-4"
                   [class.active]="regData.userType === 'ADMIN'"
                   (click)="regData.userType = 'ADMIN'">
                <i class="bi bi-shield-lock d-block fs-4 mb-1"></i>
                <span class="small fw-bold">Admin</span>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text bg-white bg-opacity-10 border-0 text-white"><i class="bi bi-lock"></i></span>
              <input type="password" class="form-control bg-white bg-opacity-10 border-0 text-white" placeholder="Password" [(ngModel)]="regData.password" name="password" required>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <span class="input-group-text bg-white bg-opacity-10 border-0 text-white"><i class="bi bi-shield-lock"></i></span>
              <input type="password" class="form-control bg-white bg-opacity-10 border-0 text-white" placeholder="Confirm Password" [(ngModel)]="regData.verifyPassword" name="verifyPassword" required>
            </div>
          </div>
          
          <button type="submit" class="btn btn-light btn-lg w-100 rounded-pill fw-bold text-primary py-3 mb-4" [disabled]="loading">
             <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
             {{ loading ? 'Creating Account...' : 'Register Now' }}
          </button>
          
          <div class="text-center">
            <p class="text-white opacity-75 small mb-0">Already have an account? <a routerLink="/login" class="text-white fw-bold">Sign In</a></p>
          </div>
        </form>
      </div>
      
      <!-- Background Circles -->
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
    </div>
  `,
  styles: [`
    .login-container { min-height: 100vh; background: #0f172a; position: relative; overflow: hidden; padding: 2rem 0; }
    .glass-login { width: 520px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); z-index: 10; }
    .form-control::placeholder { color: rgba(255,255,255,0.4); }
    .form-control:focus { background: rgba(255,255,255,0.15); box-shadow: none; color: white; }
    .bg-circle { position: absolute; border-radius: 50%; z-index: 1; }
    .circle-1 { width: 600px; height: 600px; background: radial-gradient(#3b82f6, transparent); top: -200px; left: -200px; opacity: 0.4; }
    .circle-2 { width: 500px; height: 500px; background: radial-gradient(#8b5cf6, transparent); bottom: -150px; right: -150px; opacity: 0.4; }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

    .role-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .role-card:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .role-card.active {
      background: rgba(99, 102, 241, 0.3);
      border-color: #6366f1;
      color: white;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    }
  `]
})
export class RegisterComponent {
  regData = {
    email: '',
    password: '',
    verifyPassword: '',
    userType: 'PATIENT' as 'PATIENT' | 'DOCTOR' | 'ADMIN',
    fullName: ''
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.regData.fullName || !this.regData.email || !this.regData.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.regData.password !== this.regData.verifyPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.regData.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters.';
      return;
    }

    this.loading = true;
    this.authService.register(this.regData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = `Account created successfully! Your username is: ${res.username}`;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
