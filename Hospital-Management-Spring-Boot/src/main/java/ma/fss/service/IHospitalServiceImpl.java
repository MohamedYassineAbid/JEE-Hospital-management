package ma.fss.service;

import ma.fss.entities.Consultation;
import ma.fss.entities.Medecin;
import ma.fss.entities.Patient;
import ma.fss.entities.RendezVous;
import ma.fss.repositories.ConsultationRepository;
import ma.fss.repositories.MedecinRepository;
import ma.fss.repositories.PatientRepository;
import ma.fss.repositories.RendezVousRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class IHospitalServiceImpl implements IHopitalService {
    private PatientRepository patientRepository;
    private MedecinRepository medecinRepository;
    private RendezVousRepository rendezVousRepository;
    private ConsultationRepository consultationRepository;

    public IHospitalServiceImpl(PatientRepository patientRepository,
                                MedecinRepository medecinRepository,
                                RendezVousRepository rendezVousRepository,
                                ConsultationRepository consultationRepository) {
        this.patientRepository = patientRepository;
        this.medecinRepository=medecinRepository;
        this.rendezVousRepository=rendezVousRepository;
        this.consultationRepository=consultationRepository;
    }

    @Override
    public Patient savePatient(Patient patient) {
        return patientRepository.save((patient));
    }

    @Override
    public Medecin saveMedecin(Medecin medecin) {
        return medecinRepository.save((medecin));
    }

    @Override
    public RendezVous saveRendezVous(RendezVous rendezVous) {
        if(rendezVous.getPatient()==null || rendezVous.getPatient().getId() == null){
            java.util.List<Patient> all = patientRepository.findAll();
            if(!all.isEmpty()) rendezVous.setPatient(all.get(0));
            else throw new RuntimeException("Veuillez d'abord créer un patient !");
        }
        if(rendezVous.getMedecin()==null || rendezVous.getMedecin().getId() == null){
            java.util.List<Medecin> all = medecinRepository.findAll();
            if(!all.isEmpty()) rendezVous.setMedecin(all.get(0));
            else throw new RuntimeException("Veuillez d'abord créer un médecin !");
        }

        return rendezVousRepository.save(rendezVous);
    }

    @Override
    public Consultation saveConsultation(Consultation consultation) {
        if(consultation.getRendezVous()==null || consultation.getRendezVous().getId() == null) {
            java.util.List<RendezVous> all = rendezVousRepository.findAll();
            if(!all.isEmpty()) consultation.setRendezVous(all.get(0));
            else throw new RuntimeException("Veuillez d'abord créer un rendez-vous !");
        }
        return consultationRepository.save(consultation);
    }
}
