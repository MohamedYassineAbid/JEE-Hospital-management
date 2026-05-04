import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsComponent } from './patients/patients.component';
import { DoctorComponent } from './doctors/doctor.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { AppointmentComponent } from './appointments/appointment.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'doctors', component: DoctorComponent },
  { path: 'consultations', component: ConsultationsComponent },
  { path: 'appointments', component: AppointmentComponent },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'discussions', loadComponent: () => import('./discussions/discussions.component').then(m => m.DiscussionsComponent) },
  { path: '**', redirectTo: '' }
];
