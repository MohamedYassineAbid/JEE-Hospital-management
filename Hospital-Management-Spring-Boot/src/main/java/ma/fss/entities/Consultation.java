package ma.fss.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date consultationDate;
    
    private String report;
    
    @OneToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
}
