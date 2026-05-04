import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, PageResponse } from '../services/api.service';
import { Appointment } from '../models/appointment.model';
import { Patient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointmentsPage: PageResponse<Appointment> | null = null;
  currentPage = 0;
  pageSize = 5;

  patients: Patient[] = [];
  doctors: Doctor[] = [];

  appointmentForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(private apiService: ApiService, private fb: FormBuilder, private authService: AuthService) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      status: ['PENDING', Validators.required],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.apiService.getPatients(0, 100).subscribe(data => this.patients = data.content);
    this.apiService.getDoctors(0, 100).subscribe(data => this.doctors = data.content);
  }

  loadAppointments(): void {
    const ctx = this.authService.getUserContext();
    this.apiService.getAppointments(
      this.currentPage, 
      this.pageSize, 
      ctx?.userType === 'ADMIN' ? ctx.hospitalId : undefined,
      ctx?.userType === 'PATIENT' ? ctx.patientId : undefined,
      ctx?.userType === 'DOCTOR' ? ctx.doctorId : undefined
    ).subscribe({
      next: (data) => this.appointmentsPage = data,
      error: (err) => console.error(err)
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadAppointments();
  }

  openModal(a?: Appointment): void {
    this.showModal = true;
    if (a) {
      this.editingId = a.id;
      const d = new Date(a.date);
      const strDate = d.toISOString().split('T')[0];
      this.appointmentForm.patchValue({
        date: strDate,
        status: a.status,
        patientId: a.patient?.id || '',
        doctorId: a.doctor?.id || ''
      });
    } else {
      this.editingId = undefined;
      this.appointmentForm.reset({ status: 'PENDING', patientId: '', doctorId: '' });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveAppointment(): void {
    if (this.appointmentForm.invalid) return;
    
    const val = this.appointmentForm.value;
    const data: Appointment = {
      date: val.date,
      status: val.status,
      patient: val.patientId ? { id: val.patientId } as Patient : undefined,
      doctor: val.doctorId ? { id: val.doctorId } as Doctor : undefined,
      id: this.editingId
    };

    this.apiService.saveAppointment(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadAppointments();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error saving appointment');
      }
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Delete this appointment?')) {
      this.apiService.deleteAppointment(id).subscribe({
        next: () => this.loadAppointments(),
        error: (err) => console.error(err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'COMPLETED': return 'bg-success';
      case 'CONFIRMED': return 'bg-primary';
      case 'PENDING': return 'bg-warning text-dark';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
