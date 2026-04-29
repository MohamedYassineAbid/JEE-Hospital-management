import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { RendezVous, StatusRDV } from '../models/rendezvous.model';
import { PageResponse, Patient } from '../models/patient.model';
import { Medecin } from '../models/medecin.model';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit {
  rdvPage: PageResponse<RendezVous> | null = null;
  currentPage = 0;
  pageSize = 5;

  patients: Patient[] = [];
  medecins: Medecin[] = [];

  rdvForm!: FormGroup;
  showModal = false;
  editingId?: number;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.rdvForm = this.fb.group({
      date: ['', Validators.required],
      statusRDV: ['PENDING', Validators.required],
      patientId: ['', Validators.required],
      medecinId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRDVs();
    this.apiService.getPatients(0, 100).subscribe(data => this.patients = data.content);
    this.apiService.getMedecins(0, 100).subscribe(data => this.medecins = data.content);
  }

  loadRDVs(): void {
    this.apiService.getRendezVous(this.currentPage, this.pageSize).subscribe({
      next: (data) => this.rdvPage = data,
      error: (err) => console.error(err)
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadRDVs();
  }

  openModal(r?: RendezVous): void {
    this.showModal = true;
    if (r) {
      this.editingId = r.id;
      const d = new Date(r.date);
      const strDate = d.toISOString().split('T')[0];
      this.rdvForm.patchValue({
        date: strDate,
        statusRDV: r.statusRDV,
        patientId: r.patient?.id || '',
        medecinId: r.medecin?.id || ''
      });
    } else {
      this.editingId = undefined;
      this.rdvForm.reset({ statusRDV: 'PENDING', patientId: '', medecinId: '' });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRDV(): void {
    if (this.rdvForm.invalid) return;
    
    const val = this.rdvForm.value;
    const data: RendezVous = {
      date: val.date,
      statusRDV: val.statusRDV,
      patient: val.patientId ? { id: val.patientId } as Patient : undefined,
      medecin: val.medecinId ? { id: val.medecinId } as Medecin : undefined,
      id: this.editingId
    };

    this.apiService.saveRendezVous(data).subscribe({
      next: () => {
        this.closeModal();
        this.loadRDVs();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erreur lors de la sauvegarde du rendez-vous');
      }
    });
  }

  deleteRDV(id: number): void {
    if (confirm('Supprimer ce rendez-vous ?')) {
      this.apiService.deleteRendezVous(id).subscribe({
        next: () => this.loadRDVs(),
        error: (err) => console.error(err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'DONE': return 'bg-success';
      case 'PENDING': return 'bg-warning text-dark';
      case 'CANCELED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
