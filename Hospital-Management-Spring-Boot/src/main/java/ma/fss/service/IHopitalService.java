package ma.fss.service;

import ma.fss.entities.Consultation;
import ma.fss.entities.Medecin;
import ma.fss.entities.Patient;
import ma.fss.entities.RendezVous;

public interface IHopitalService {
    Patient savePatient(Patient patient);
    Medecin saveMedecin(Medecin medecin);
    RendezVous saveRendezVous(RendezVous rendezVous);
    Consultation saveConsultation(Consultation consultation);
}
