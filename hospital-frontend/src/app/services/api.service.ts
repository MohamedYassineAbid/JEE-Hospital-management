import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';
import { Consultation } from '../models/consultation.model';
import { environment } from '../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Helper method for multi-tenancy params
  private getParams(page: number, size: number, keyword?: string, hospitalId?: number, patientId?: number, doctorId?: number): HttpParams {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword !== undefined && keyword !== null) params = params.set('keyword', keyword);
    if (hospitalId) params = params.set('hospitalId', hospitalId);
    if (patientId) params = params.set('patientId', patientId);
    if (doctorId) params = params.set('doctorId', doctorId);
    return params;
  }

  // --- Patients ---
  getPatients(page: number = 0, size: number = 5, keyword: string = '', hospitalId?: number): Observable<PageResponse<Patient>> {
    const params = this.getParams(page, size, keyword, hospitalId);
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

  // --- Doctors ---
  getDoctors(page: number = 0, size: number = 5, keyword: string = '', hospitalId?: number): Observable<PageResponse<Doctor>> {
    const params = this.getParams(page, size, keyword, hospitalId);
    return this.http.get<PageResponse<Doctor>>(`${this.apiUrl}/doctors`, { params });
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctors/${id}`);
  }

  saveDoctor(doctor: Doctor): Observable<Doctor> {
    if (doctor.id) {
      return this.http.put<Doctor>(`${this.apiUrl}/doctors/${doctor.id}`, doctor);
    }
    return this.http.post<Doctor>(`${this.apiUrl}/doctors`, doctor);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/doctors/${id}`);
  }

  // --- Appointments ---
  getAppointments(page: number = 0, size: number = 5, hospitalId?: number, patientId?: number, doctorId?: number): Observable<PageResponse<Appointment>> {
    const params = this.getParams(page, size, undefined, hospitalId, patientId, doctorId);
    return this.http.get<PageResponse<Appointment>>(`${this.apiUrl}/appointments`, { params });
  }

  saveAppointment(appointment: Appointment): Observable<Appointment> {
    if (appointment.id) {
      return this.http.put<Appointment>(`${this.apiUrl}/appointments/${appointment.id}`, appointment);
    }
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`);
  }

  // --- Consultations ---
  getConsultations(page: number = 0, size: number = 5, hospitalId?: number, patientId?: number, doctorId?: number): Observable<PageResponse<Consultation>> {
    const params = this.getParams(page, size, undefined, hospitalId, patientId, doctorId);
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

  // --- Stats ---
  getStats(hospitalId?: number): Observable<any> {
    let params = new HttpParams();
    if (hospitalId) params = params.set('hospitalId', hospitalId);
    return this.http.get<any>(`${this.apiUrl}/stats/summary`, { params });
  }
}
