import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Consultation } from '../models/consultation.model';
import { RendezVous } from '../models/rendezvous.model';
import { PageResponse } from '../models/patient.model';

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

  rendezvousList: RendezVous[] = [];

  consultationForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.consultationForm = this.fb.group({
      dateConsultation: ['', Validators.required],
      rapport: ['', Validators.required],
      rendezVousId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadConsultations();
    this.apiService.getRendezVous(0, 100).subscribe(data => this.rendezvousList = data.content);
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
      const d = new Date(c.dateConsultation);
      const strDate = d.toISOString().split('T')[0];
      this.consultationForm.patchValue({
        dateConsultation: strDate,
        rapport: c.rapport,
        rendezVousId: c.rendezVous?.id || ''
      });
    } else {
      this.editingId = undefined;
      this.consultationForm.reset({ rendezVousId: '' });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveConsultation(): void {
    if (this.consultationForm.invalid) return;
    
    const val = this.consultationForm.value;
    const data: Consultation = {
      dateConsultation: val.dateConsultation,
      rapport: val.rapport,
      rendezVous: val.rendezVousId ? { id: val.rendezVousId } as RendezVous : undefined,
      id: this.editingId
    };

    this.apiService.saveConsultation(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadConsultations();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erreur lors de la sauvegarde de la consultation');
      }
    });
  }

  deleteConsultation(id: number): void {
    if (confirm('Supprimer cette consultation ?')) {
      this.apiService.deleteConsultation(id).subscribe({
        next: () => this.loadConsultations(),
        error: (err) => console.error(err)
      });
    }
  }
}
