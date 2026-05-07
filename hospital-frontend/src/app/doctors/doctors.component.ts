import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, PageResponse } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctorsPage: PageResponse<Doctor> | null = null;
  currentPage = 0;
  pageSize = 5;
  keyword = '';

  doctorForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(private apiService: ApiService, private fb: FormBuilder, public auth: AuthService) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.apiService.getDoctors(this.currentPage, this.pageSize, this.keyword).subscribe({
      next: (data) => this.doctorsPage = data,
      error: (err) => console.error(err)
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadDoctors();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadDoctors();
  }

  openModal(doctor?: Doctor): void {
    this.showModal = true;
    if (doctor) {
      this.editingId = doctor.id;
      this.doctorForm.patchValue(doctor);
    } else {
      this.editingId = undefined;
      this.doctorForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) return;
    
    const data: Doctor = {
      ...this.doctorForm.value,
      id: this.editingId
    };

    this.apiService.saveDoctor(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadDoctors();
      },
      error: (err) => console.error(err)
    });
  }

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.apiService.deleteDoctor(id).subscribe({
        next: () => this.loadDoctors(),
        error: (err) => console.error(err)
      });
    }
  }
}
