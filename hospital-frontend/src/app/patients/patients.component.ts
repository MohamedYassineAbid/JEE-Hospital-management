import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, PageResponse } from '../services/api.service';
import { Patient } from '../models/patient.model';

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

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
      sick: [false],
      address: [''],
      zipCode: [''],
      phoneNumber: [''],
      title: ['MR']
    });
  }

  loadPatients(): void {
    this.apiService.getPatients(this.currentPage, this.pageSize, this.keyword).subscribe({
      next: (data) => this.patientsPage = data,
      error: (err) => console.error(err)
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
      // Format date for date input
      const d = new Date(patient.birthDate);
      const strDate = d.toISOString().split('T')[0];
      
      this.patientForm.patchValue({
        ...patient,
        birthDate: strDate
      });
    } else {
      this.editingId = undefined;
      this.patientForm.reset({ sick: false, title: 'MR' });
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
        this.closeModal();
        this.loadPatients();
      },
      error: (err) => console.error('Error saving patient', err)
    });
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.apiService.deletePatient(id).subscribe({
        next: () => this.loadPatients(),
        error: (err) => console.error('Error deleting patient', err)
      });
    }
  }
}
