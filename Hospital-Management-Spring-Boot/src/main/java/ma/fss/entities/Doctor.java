package ma.fss.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor
public class Doctor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 255)
    private String name;
    @Column(length = 255)
    private String email;
    private String specialty; 
    @Column(length = 255)
    private String username;
    
    private String workContact;
    private String dayOff; 
    
    private int morningCapacity;   
    private int afternoonCapacity; 
}
