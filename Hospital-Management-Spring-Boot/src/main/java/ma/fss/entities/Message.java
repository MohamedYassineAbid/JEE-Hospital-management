package ma.fss.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String senderUsername;
    private String receiverUsername;
    
    @Column(length = 1000)
    private String content;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;
    
    private boolean seen = false;
}
