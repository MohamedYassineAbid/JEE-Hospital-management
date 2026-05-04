package ma.fss.security.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {
    @Id
    private String userId;
    @Column(unique = true)
    private String username;
    @Column(unique = true)
    private String email;
    private String password;
    private boolean active;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<AppRole> appRoles = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private UserType userType;

    // Profile fields
    private String firstName;
    private String lastName;
    private String photoUrl;

    // Optional relationships based on UserType
    private Long hospitalId; // For ADMIN (which hospital they manage)
    private Long doctorId;   // For DOCTOR (link to Doctor profile)
    private Long patientId;  // For PATIENT (link to Patient profile)
}
