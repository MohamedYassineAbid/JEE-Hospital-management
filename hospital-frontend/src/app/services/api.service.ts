import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, PageResponse } from '../models/patient.model';
import { Medecin } from '../models/medecin.model';
import { RendezVous } from '../models/rendezvous.model';
import { Consultation } from '../models/consultation.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient) { }

  // --- Patients ---
  getPatients(page: number = 0, size: number = 5, keyword: string = ''): Observable<PageResponse<Patient>> {
    const params = new HttpParams().set('page', page).set('size', size).set('keyword', keyword);
    return this.http.get<PageResponse<Patient>>(`${this.apiUrl}/patients`, { params });
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  savePatient(patient: Patient): Observable<Patient> {
    if (patient.id) {
      return this.http.put<Patient>(`${this.apiUrl}/patients/${patient.id}`, patient);
    }
    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patients/${id}`);
  }

  // --- Medecins ---
  getMedecins(page: number = 0, size: number = 5, keyword: string = ''): Observable<PageResponse<Medecin>> {
    const params = new HttpParams().set('page', page).set('size', size).set('keyword', keyword);
    return this.http.get<PageResponse<Medecin>>(`${this.apiUrl}/medecins`, { params });
  }

  getMedecin(id: number): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.apiUrl}/medecins/${id}`);
  }

  saveMedecin(medecin: Medecin): Observable<Medecin> {
    if (medecin.id) {
      return this.http.put<Medecin>(`${this.apiUrl}/medecins/${medecin.id}`, medecin);
    }
    return this.http.post<Medecin>(`${this.apiUrl}/medecins`, medecin);
  }

  deleteMedecin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/medecins/${id}`);
  }

  // --- Rendez-vous ---
  getRendezVous(page: number = 0, size: number = 5): Observable<PageResponse<RendezVous>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<RendezVous>>(`${this.apiUrl}/rendezvous`, { params });
  }

  saveRendezVous(rdv: RendezVous): Observable<RendezVous> {
    if (rdv.id) {
      return this.http.put<RendezVous>(`${this.apiUrl}/rendezvous/${rdv.id}`, rdv);
    }
    return this.http.post<RendezVous>(`${this.apiUrl}/rendezvous`, rdv);
  }

  deleteRendezVous(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rendezvous/${id}`);
  }

  // --- Consultations ---
  getConsultations(page: number = 0, size: number = 5): Observable<PageResponse<Consultation>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Consultation>>(`${this.apiUrl}/consultations`, { params });
  }

  saveConsultation(consultation: Consultation): Observable<Consultation> {
    if (consultation.id) {
      return this.http.put<Consultation>(`${this.apiUrl}/consultations/${consultation.id}`, consultation);
    }
    return this.http.post<Consultation>(`${this.apiUrl}/consultations`, consultation);
  }

  deleteConsultation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/consultations/${id}`);
  }
}
