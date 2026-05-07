import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  authError = '';

  loginData = { username: '', password: '' };
  // ... (signupData stays same)
  signupData: any = {
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT',
    // Patient fields
    cin: '',
    // Doctor fields
    secretKey: '',
    specialty: '',
    morningCapacity: '5',
    afternoonCapacity: '3',
    dayOff: 'SUNDAY'
  };

  specialities: string[] = [
    'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 
    'Dermatology', 'Psychiatry', 'Orthopedics', 'Gynecology'
  ];
  daysOfWeek: string[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    const mode = this.route.snapshot.queryParamMap.get('mode');
    if (mode === 'signup') {
      this.isLoginMode = false;
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.authError = '';
  }

  onLogin(): void {
    this.authError = '';
    if (!this.loginData.username || !this.loginData.password) {
      this.authError = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success(`Welcome back, ${this.loginData.username}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.authError = err.error?.error || err.error?.message || 'Invalid username or password. Please try again.';
      }
    });
  }

  onSignUp(): void {
    this.authError = '';
    if (!this.signupData.username || !this.signupData.password || !this.signupData.confirmPassword) {
      this.authError = 'All fields marked with * are required';
      return;
    }

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.authError = 'Confirmation password does not match the password';
      return;
    }

    if (this.signupData.role === 'DOCTOR' && !this.signupData.secretKey) {
      this.authError = 'Doctor verification key is required';
      return;
    }

    if (this.signupData.role === 'PATIENT' && !this.signupData.cin) {
      this.authError = 'National ID (CIN) is required for patients';
      return;
    }

    this.isLoading = true;
    this.authService.register(this.signupData).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Registration successful! Please sign in.');
        this.isLoginMode = true;
        this.loginData.username = this.signupData.username;
        this.authError = '';
        this.signupData = {
          username: '', name: '', password: '', confirmPassword: '', role: 'PATIENT',
          cin: '', secretKey: '', specialty: '', morningCapacity: '5',
          afternoonCapacity: '3', dayOff: 'SUNDAY'
        };
      },
      error: (err) => {
        this.isLoading = false;
        this.authError = err.error?.error || err.error?.message || err.message || 'Registration failed. This username or CIN may already be in use.';
      }
    });
  }
}
