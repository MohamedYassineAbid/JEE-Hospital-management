import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, PageResponse } from '../services/api.service';
import { Appointment } from '../models/appointment.model';
import { Patient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointmentPage: PageResponse<Appointment> | null = null;
  currentPage = 0;
  pageSize = 5;

  patients: Patient[] = [];
  doctors: Doctor[] = [];

  appointmentForm!: FormGroup;
  completeForm!: FormGroup;

  showModal = false;
  showCompleteModal = false;
  editingId?: number;
  selectedAppointment?: Appointment;

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    private toast: ToastService,
    public auth: AuthService
  ) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      session: ['MORNING', Validators.required],
      status: ['PENDING', Validators.required],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required]
    });

    this.completeForm = this.fb.group({
      report: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.apiService.getPatients(0, 100).subscribe(data => this.patients = data.content);
    this.apiService.getDoctors(0, 100).subscribe(data => this.doctors = data.content);
  }

  loadAppointments(): void {
    this.apiService.getAppointments(this.currentPage, this.pageSize).subscribe({
      next: (data) => this.appointmentPage = data,
      error: (err) => this.toast.error('Failed to load appointments')
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadAppointments();
  }

  openModal(r?: Appointment): void {
    this.showModal = true;
    if (r) {
      this.editingId = r.id;
      const d = new Date(r.date);
      const strDate = d.toISOString().split('T')[0];
      this.appointmentForm.patchValue({
        date: strDate,
        session: r.session || 'MORNING',
        status: r.status,
        patientId: r.patient?.id || '',
        doctorId: r.doctor?.id || ''
      });
    } else {
      this.editingId = undefined;
      this.appointmentForm.reset({ 
        session: 'MORNING', 
        status: 'PENDING', 
        patientId: '', 
        doctorId: '' 
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  openCompleteModal(r: Appointment): void {
    this.selectedAppointment = r;
    this.showCompleteModal = true;
    this.completeForm.reset();
  }

  closeCompleteModal(): void {
    this.showCompleteModal = false;
  }

  saveAppointment(): void {
    const isPatient = this.auth.getRole() === 'PATIENT';
    
    // If patient, we don't need patientId to be valid in the form since we set it manually
    if (isPatient) {
        this.appointmentForm.get('patientId')?.clearValidators();
        this.appointmentForm.get('patientId')?.updateValueAndValidity();
    }

    if (this.appointmentForm.invalid) {
        console.log('Form Invalid:', this.appointmentForm.value);
        this.toast.error('Please fill all required fields');
        return;
    }
    
    const val = this.appointmentForm.value;
    const data: Appointment = {
      date: val.date,
      session: val.session,
      status: val.status,
      patient: val.patientId ? { id: Number(val.patientId) } as Patient : undefined,
      doctor: val.doctorId ? { id: Number(val.doctorId) } as Doctor : undefined,
      id: this.editingId
    };

    if (isPatient) {
        data.patient = { username: this.auth.getUsername() } as Patient;
    }

    this.apiService.saveAppointment(data).subscribe({
      next: () => {
        this.toast.success('Appointment saved successfully');
        this.closeModal();
        this.loadAppointments();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error saving appointment');
      }
    });
  }

  confirmComplete(): void {
    if (this.completeForm.invalid || !this.selectedAppointment) return;

    this.apiService.completeAppointment(this.selectedAppointment.id!, this.completeForm.value.report).subscribe({
        next: () => {
            this.toast.success('Appointment completed and medical record created!');
            this.closeCompleteModal();
            this.loadAppointments();
        },
        error: (err) => {
            this.toast.error(err.error?.message || 'Error completing appointment');
        }
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.apiService.deleteAppointment(id).subscribe({
        next: () => {
          this.toast.success('Appointment deleted');
          this.loadAppointments();
        },
        error: (err) => this.toast.error('Error deleting appointment')
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'DONE': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'CANCELED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}
