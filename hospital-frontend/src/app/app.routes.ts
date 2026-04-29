import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsComponent } from './patients/patients.component';
import { MedecinsComponent } from './medecins/medecins.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { RendezvousComponent } from './rendezvous/rendezvous.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'medecins', component: MedecinsComponent },
  { path: 'consultations', component: ConsultationsComponent },
  { path: 'rendezvous', component: RendezvousComponent },
  { path: '**', redirectTo: 'dashboard' }
];
