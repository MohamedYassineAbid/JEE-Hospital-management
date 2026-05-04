package ma.fss.security.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.fss.security.entities.AppRole;
import ma.fss.security.entities.AppUser;
import ma.fss.security.entities.UserType;
import ma.fss.security.repositories.AppRoleRepository;
import ma.fss.security.repositories.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class SecurityServiceImpl implements SecurityService {
    private AppUserRepository appUserRepository;
    private AppRoleRepository appRoleRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public AppUser saveNewUser(String email, String password, String verifyPassword, UserType userType, Long associationId) {
        if (!password.equals(verifyPassword)) throw new RuntimeException("Passwords do not match");
        AppUser existingUser = appUserRepository.findByEmail(email);
        if (existingUser != null) return existingUser;
        
        String hashedPWD = passwordEncoder.encode(password);
        AppUser appUser = new AppUser();
        appUser.setUserId(UUID.randomUUID().toString());
        appUser.setEmail(email);
        appUser.setPassword(hashedPWD);
        appUser.setActive(true);
        appUser.setUserType(userType);
        
        // Generate a default username if not provided (e.g. for initial seeding)
        String baseName = email.split("@")[0].replace(".", "_").toLowerCase();
        appUser.setUsername(generateFormattedUsername(userType, baseName));
        
        // Set default profile name from email
        appUser.setFirstName(baseName.split("_")[0]);
        appUser.setLastName(baseName.contains("_") ? baseName.split("_")[1] : "");
        
        if (userType != null) {
            switch (userType) {
                case ADMIN: appUser.setHospitalId(associationId); break;
                case DOCTOR: appUser.setDoctorId(associationId); break;
                case PATIENT: appUser.setPatientId(associationId); break;
            }
        }
        
        return appUserRepository.save(appUser);
    }

    @Override
    public AppUser registerUser(String email, String password, String verifyPassword, UserType userType, String fullName) {
        if (!password.equals(verifyPassword)) throw new RuntimeException("Passwords do not match");
        if (appUserRepository.findByEmail(email) != null) throw new RuntimeException("Email already registered");
        
        String baseName = fullName.trim().toLowerCase().replace(" ", "_");
        String formattedUsername = generateFormattedUsername(userType, baseName);
        
        // Parse fullName into first/last
        String[] nameParts = fullName.trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        
        AppUser appUser = new AppUser();
        appUser.setUserId(UUID.randomUUID().toString());
        appUser.setEmail(email);
        appUser.setUsername(formattedUsername);
        appUser.setPassword(passwordEncoder.encode(password));
        appUser.setActive(true);
        appUser.setUserType(userType);
        appUser.setFirstName(firstName);
        appUser.setLastName(lastName);
        
        // Roles based on type
        AppUser saved = appUserRepository.save(appUser);
        if (userType != null) {
            addRoleToUserByEmail(email, userType.name());
        }
        
        return saved;
    }

    @Override
    public AppUser updateProfile(String email, String firstName, String lastName, String photoUrl) {
        AppUser appUser = appUserRepository.findByEmail(email);
        if (appUser == null) throw new RuntimeException("User not found");
        if (firstName != null) appUser.setFirstName(firstName);
        if (lastName != null) appUser.setLastName(lastName);
        if (photoUrl != null) appUser.setPhotoUrl(photoUrl);
        return appUserRepository.save(appUser);
    }

    private String generateFormattedUsername(UserType type, String baseName) {
        String prefix = (type != null ? type.name().toLowerCase() : "user") + "_" + baseName + "_";
        long count = appUserRepository.countByUsernameStartingWith(prefix);
        return prefix + String.format("%03d", count + 1);
    }

    @Override
    public AppRole saveNewRole(String roleName, String description) {
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        if (appRole != null) return appRole;
        appRole = new AppRole();
        appRole.setRoleName(roleName);
        appRole.setDescription(description);
        return appRoleRepository.save(appRole);
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public AppUser loadUserByEmail(String email) {
        return appUserRepository.findByEmail(email);
    }

    public void addRoleToUserByEmail(String email, String roleName) {
        AppUser appUser = appUserRepository.findByEmail(email);
        if (appUser == null) throw new RuntimeException("User not found");
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        if (appRole == null) throw new RuntimeException("Role not found");
        appUser.getAppRoles().add(appRole);
    }

    // Keeping the original signature for compatibility if needed, but updating implementation
    public void addRoleToUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        if (appUser == null) throw new RuntimeException("User not found");
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        if (appRole == null) throw new RuntimeException("Role not found");
        appUser.getAppRoles().add(appRole);
    }

    @Override
    public void removeRoleFromUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        if (appUser == null) throw new RuntimeException("User not found");
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        if (appRole == null) throw new RuntimeException("Role not found");
        appUser.getAppRoles().remove(appRole);
    }
}
