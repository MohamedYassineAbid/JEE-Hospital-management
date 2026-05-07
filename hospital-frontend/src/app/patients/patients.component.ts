import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, PageResponse } from '../services/api.service';
import { Patient } from '../models/patient.model';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patientsPage: PageResponse<Patient> | null = null;
  currentPage = 0;
  pageSize = 5;
  keyword = '';

  patientForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      birthDate: ['', Validators.required],
      sick: [false],
      address: [''],
      phoneNumber: ['']
    });
  }

  loadPatients(): void {
    this.apiService.getPatients(this.currentPage, this.pageSize, this.keyword).subscribe({
      next: (data) => this.patientsPage = data,
      error: (err) => this.toast.error('Failed to load patients')
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadPatients();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadPatients();
  }

  openModal(patient?: Patient): void {
    this.showModal = true;
    if (patient) {
      this.editingId = patient.id;
      const d = new Date(patient.birthDate);
      const strDate = d.toISOString().split('T')[0];
      
      this.patientForm.patchValue({
        ...patient,
        birthDate: strDate
      });
    } else {
      this.editingId = undefined;
      this.patientForm.reset({ sick: false });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePatient(): void {
    if (this.patientForm.invalid) return;
    
    const patientData: Patient = {
      ...this.patientForm.value,
      id: this.editingId
    };

    this.apiService.savePatient(patientData).subscribe({
      next: () => {
        this.toast.success('Patient saved successfully');
        this.closeModal();
        this.loadPatients();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error saving patient');
      }
    });
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.apiService.deletePatient(id).subscribe({
        next: () => {
          this.toast.success('Patient deleted');
          this.loadPatients();
        },
        error: (err) => this.toast.error('Error deleting patient')
      });
    }
  }
}
