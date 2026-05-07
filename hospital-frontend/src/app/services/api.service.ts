import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';
import { Consultation } from '../models/consultation.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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

  // --- Doctors ---
  getDoctors(page: number = 0, size: number = 5, keyword: string = ''): Observable<PageResponse<Doctor>> {
    const params = new HttpParams().set('page', page).set('size', size).set('keyword', keyword);
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
  getAppointments(page: number = 0, size: number = 5): Observable<PageResponse<Appointment>> {
    const params = new HttpParams().set('page', page).set('size', size);
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

  // --- Medical Records (Consultations) ---
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

  checkAvailability(doctorId?: number, username?: string, date?: string, excludeId?: number): Observable<any> {
    let params = new HttpParams();
    if (doctorId) params = params.set('doctorId', doctorId.toString());
    if (username) params = params.set('username', username);
    if (date) params = params.set('date', date);
    if (excludeId) params = params.set('excludeId', excludeId.toString());
    return this.http.get(`${this.apiUrl}/appointments/availability`, { params });
  }

  completeAppointment(id: number, report: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments/${id}/complete`, { report });
  }

  // --- Messaging ---
  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages/send`, message);
  }

  getConversation(u1: string, u2: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/conversation?u1=${u1}&u2=${u2}`);
  }

  getUnreadMessages(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/unread?username=${username}`);
  }

  markMessagesRead(sender: string, receiver: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/messages/mark-read?sender=${sender}&receiver=${receiver}`, {});
  }

  // --- Statistics ---
  getDoctorStats(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/doctor?username=${username}`);
  }

  getPatientStats(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/patient?username=${username}`);
  }
}
