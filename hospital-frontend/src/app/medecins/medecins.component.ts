import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Medecin } from '../models/medecin.model';
import { PageResponse } from '../models/patient.model';

@Component({
  selector: 'app-medecins',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medecins.component.html',
  styleUrls: ['./medecins.component.css']
})
export class MedecinsComponent implements OnInit {
  medecinsPage: PageResponse<Medecin> | null = null;
  currentPage = 0;
  pageSize = 5;
  keyword = '';

  medecinForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.medecinForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialite: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedecins();
  }

  loadMedecins(): void {
    this.apiService.getMedecins(this.currentPage, this.pageSize, this.keyword).subscribe({
      next: (data) => this.medecinsPage = data,
      error: (err) => console.error(err)
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadMedecins();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadMedecins();
  }

  openModal(medecin?: Medecin): void {
    this.showModal = true;
    if (medecin) {
      this.editingId = medecin.id;
      this.medecinForm.patchValue(medecin);
    } else {
      this.editingId = undefined;
      this.medecinForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveMedecin(): void {
    if (this.medecinForm.invalid) return;
    
    const data: Medecin = {
      ...this.medecinForm.value,
      id: this.editingId
    };

    this.apiService.saveMedecin(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadMedecins();
      },
      error: (err) => console.error(err)
    });
  }

  deleteMedecin(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      this.apiService.deleteMedecin(id).subscribe({
        next: () => this.loadMedecins(),
        error: (err) => console.error(err)
      });
    }
  }
}
