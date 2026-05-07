package ma.fss.security.service;


import ma.fss.security.entities.AppRole;
import ma.fss.security.entities.AppUser;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface SecurityService extends UserDetailsService {
    AppUser saveNewUser(String username, String password, String verifyPassword);
    AppUser saveNewUserWithRole(String username, String password, String verifyPassword, String roleName);
    AppRole saveNewRole(String roleName, String description);
    void addRoleToUser(String username, String roleName);
    AppUser loadAppUserByUsername(String username); 
    void removeRoleFromUser(String username, String roleName);
}
