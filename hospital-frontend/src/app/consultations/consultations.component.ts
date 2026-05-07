import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, PageResponse } from '../services/api.service';
import { Consultation } from '../models/consultation.model';
import { Appointment } from '../models/appointment.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.css']
})
export class ConsultationsComponent implements OnInit {
  consultationsPage: PageResponse<Consultation> | null = null;
  currentPage = 0;
  pageSize = 5;

  appointmentsList: Appointment[] = [];

  consultationForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(private apiService: ApiService, private fb: FormBuilder, public auth: AuthService) {
    this.consultationForm = this.fb.group({
      consultationDate: ['', Validators.required],
      report: ['', Validators.required],
      appointmentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadConsultations();
    this.apiService.getAppointments(0, 100).subscribe(data => this.appointmentsList = data.content);
  }

  loadConsultations(): void {
    this.apiService.getConsultations(this.currentPage, this.pageSize).subscribe({
      next: (data) => this.consultationsPage = data,
      error: (err) => console.error(err)
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadConsultations();
  }

  openModal(c?: Consultation): void {
    this.showModal = true;
    if (c) {
      this.editingId = c.id;
      const d = new Date(c.consultationDate);
      const strDate = d.toISOString().split('T')[0];
      this.consultationForm.patchValue({
        consultationDate: strDate,
        report: c.report,
        appointmentId: c.appointment?.id || ''
      });
    } else {
      this.editingId = undefined;
      this.consultationForm.reset({ appointmentId: '' });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveConsultation(): void {
    if (this.consultationForm.invalid) return;
    
    const val = this.consultationForm.value;
    const data: Consultation = {
      consultationDate: val.consultationDate,
      report: val.report,
      appointment: val.appointmentId ? { id: val.appointmentId } as Appointment : undefined,
      id: this.editingId
    };

    this.apiService.saveConsultation(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadConsultations();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error saving medical record');
      }
    });
  }

  deleteConsultation(id: number): void {
    if (confirm('Delete this medical record?')) {
      this.apiService.deleteConsultation(id).subscribe({
        next: () => this.loadConsultations(),
        error: (err) => console.error(err)
      });
    }
  }
}
