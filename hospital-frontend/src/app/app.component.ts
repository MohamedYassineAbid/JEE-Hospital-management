import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hospital-frontend';

  constructor(public auth: AuthService) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get username(): string {
    return this.auth.getUsername();
  }

  get role(): string {
    return this.auth.getRole();
  }

  get roleBadgeClass(): string {
    switch (this.role) {
      case 'ADMIN': return 'badge-admin';
      case 'DOCTOR': return 'badge-doctor';
      case 'PATIENT': return 'badge-patient';
      default: return '';
    }
  }

  get roleLabel(): string {
    switch (this.role) {
      case 'ADMIN': return 'Administrateur';
      case 'DOCTOR': return 'Médecin';
      case 'PATIENT': return 'Patient';
      default: return '';
    }
  }

  logout(): void {
    this.auth.logout();
  }

  // Role-based menu visibility
  canSee(item: string): boolean {
    switch (item) {
      case 'dashboard':
        return true;
      case 'patients':
        return this.role === 'ADMIN' || this.role === 'DOCTOR';
      case 'medecins':
        return this.role === 'ADMIN';
      case 'consultations':
        return this.role === 'ADMIN' || this.role === 'DOCTOR' || this.role === 'PATIENT';
      case 'rendezvous':
        return true;
      default:
        return false;
    }
  }
}
