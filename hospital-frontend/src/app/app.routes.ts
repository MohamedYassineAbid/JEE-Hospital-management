import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsComponent } from './patients/patients.component';
import { MedecinsComponent } from './medecins/medecins.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { RendezvousComponent } from './rendezvous/rendezvous.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'medecins', component: MedecinsComponent, canActivate: [authGuard] },
  { path: 'consultations', component: ConsultationsComponent, canActivate: [authGuard] },
  { path: 'rendezvous', component: RendezvousComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
