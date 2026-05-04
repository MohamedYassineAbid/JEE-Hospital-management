import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserContext } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid fade-in">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">

          <!-- Profile Header Card -->
          <div class="profile-header-card card border-0 mb-4 overflow-hidden">
            <div class="profile-banner"></div>
            <div class="card-body text-center position-relative" style="margin-top: -60px;">
              <div class="avatar-wrapper mx-auto mb-3">
                <img [src]="getAvatarUrl()" class="profile-avatar" alt="Profile Photo">
                <label class="avatar-edit-btn" title="Change Photo">
                  <i class="bi bi-camera-fill"></i>
                  <input type="file" accept="image/*" (change)="onPhotoSelected($event)" class="d-none">
                </label>
              </div>
              <h3 class="fw-bold mb-1">{{ profileData.firstName }} {{ profileData.lastName }}</h3>
              <p class="text-muted mb-2">{{ profileData.email }}</p>
              <span class="badge rounded-pill px-3 py-2" [ngClass]="getRoleBadgeClass()">
                <i [class]="getRoleIcon() + ' me-1'"></i>
                {{ profileData.userType }}
              </span>
            </div>
          </div>

          <!-- Profile Edit Form -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-transparent border-0 p-4">
              <h5 class="fw-bold mb-0"><i class="bi bi-person-gear me-2 text-primary"></i>Personal Information</h5>
            </div>
            <div class="card-body p-4 pt-0">
              <!-- Success/Error Messages -->
              <div *ngIf="successMessage" class="alert alert-success rounded-4 mb-4">
                <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
              </div>
              <div *ngIf="errorMessage" class="alert alert-danger rounded-4 mb-4">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
              </div>

              <form (ngSubmit)="saveProfile()">
                <div class="row g-4 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-medium">First Name</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0"><i class="bi bi-person text-muted"></i></span>
                      <input type="text" class="form-control border-start-0" placeholder="Enter first name" [(ngModel)]="profileData.firstName" name="firstName" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Last Name</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0"><i class="bi bi-person text-muted"></i></span>
                      <input type="text" class="form-control border-start-0" placeholder="Enter last name" [(ngModel)]="profileData.lastName" name="lastName" required>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                    <input type="email" class="form-control border-start-0 bg-light" [value]="profileData.email" disabled>
                  </div>
                  <small class="text-muted mt-1 d-block">Email cannot be changed</small>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Username</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-at text-muted"></i></span>
                    <input type="text" class="form-control border-start-0 bg-light" [value]="profileData.username" disabled>
                  </div>
                  <small class="text-muted mt-1 d-block">Auto-generated username</small>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Photo URL</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-link-45deg text-muted"></i></span>
                    <input type="url" class="form-control border-start-0" placeholder="https://example.com/photo.jpg" [(ngModel)]="profileData.photoUrl" name="photoUrl">
                  </div>
                  <small class="text-muted mt-1 d-block">Paste an image URL or leave empty for default avatar</small>
                </div>

                <div class="d-flex justify-content-end gap-3 border-top pt-4">
                  <button type="button" class="btn btn-light border px-4 rounded-pill" (click)="resetForm()">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
                  </button>
                  <button type="submit" class="btn btn-primary px-4 rounded-pill" [disabled]="saving">
                    <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!saving" class="bi bi-check2-circle me-1"></i>
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Account Info Card -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0 p-4">
              <h5 class="fw-bold mb-0"><i class="bi bi-info-circle me-2 text-primary"></i>Account Details</h5>
            </div>
            <div class="card-body p-4 pt-0">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-4">
                    <p class="text-muted small mb-1">Account Type</p>
                    <p class="fw-bold mb-0">{{ profileData.userType }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-4">
                    <p class="text-muted small mb-1">User ID</p>
                    <p class="fw-bold mb-0 text-truncate" [title]="profileData.userId">{{ profileData.userId?.substring(0, 8) }}...</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-4">
                    <p class="text-muted small mb-1">Status</p>
                    <p class="fw-bold mb-0 text-success"><i class="bi bi-circle-fill me-1" style="font-size:0.5rem"></i>Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-banner {
      height: 160px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .avatar-wrapper {
      width: 120px;
      height: 120px;
      position: relative;
    }
    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 5px solid white;
      object-fit: cover;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .avatar-edit-btn {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 36px;
      height: 36px;
      background: #6366f1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      border: 3px solid white;
      transition: all 0.2s ease;
    }
    .avatar-edit-btn:hover {
      background: #4f46e5;
      transform: scale(1.1);
    }
    .form-control:focus {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      border-color: #6366f1;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileData: any = {
    userId: '',
    username: '',
    email: '',
    userType: '',
    firstName: '',
    lastName: '',
    photoUrl: ''
  };

  originalData: any = {};
  saving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Load from local storage first for instant display
    const ctx = this.authService.getUserContext();
    if (ctx) {
      this.profileData = { ...ctx };
      this.originalData = { ...ctx };
    }

    // Then refresh from backend
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profileData = { ...data };
        this.originalData = { ...data };
        this.authService.setUserContext(data);
      },
      error: () => {} // Silently fail, we already have local data
    });
  }

  getAvatarUrl(): string {
    if (this.profileData.photoUrl) {
      return this.profileData.photoUrl;
    }
    const name = `${this.profileData.firstName || ''} ${this.profileData.lastName || ''}`.trim() || this.profileData.username || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200&bold=true`;
  }

  getRoleBadgeClass(): string {
    switch (this.profileData.userType) {
      case 'ADMIN': return 'bg-danger bg-opacity-10 text-danger';
      case 'DOCTOR': return 'bg-success bg-opacity-10 text-success';
      case 'PATIENT': return 'bg-primary bg-opacity-10 text-primary';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  }

  getRoleIcon(): string {
    switch (this.profileData.userType) {
      case 'ADMIN': return 'bi bi-shield-lock-fill';
      case 'DOCTOR': return 'bi bi-heart-pulse-fill';
      case 'PATIENT': return 'bi bi-person-heart';
      default: return 'bi bi-person';
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Convert to base64 data URL for preview (in production, you'd upload to a server)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.photoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (!this.profileData.firstName || !this.profileData.lastName) {
      this.errorMessage = 'First name and last name are required.';
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateProfile({
      email: this.profileData.email,
      firstName: this.profileData.firstName,
      lastName: this.profileData.lastName,
      photoUrl: this.profileData.photoUrl || undefined
    }).subscribe({
      next: (data) => {
        this.saving = false;
        this.successMessage = 'Profile updated successfully!';
        this.profileData = { ...data };
        this.originalData = { ...data };
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.error || 'Failed to update profile.';
      }
    });
  }

  resetForm(): void {
    this.profileData = { ...this.originalData };
    this.successMessage = '';
    this.errorMessage = '';
  }
}
