package ma.fss.security.service;


import ma.fss.security.entities.AppRole;
import ma.fss.security.entities.AppUser;

import ma.fss.security.entities.UserType;

public interface SecurityService {
    AppUser saveNewUser(String email, String password, String verifyPassword, UserType userType, Long associationId);
    AppUser registerUser(String email, String password, String verifyPassword, UserType userType, String fullName);
    AppRole saveNewRole(String roleName, String description);
    AppUser loadUserByUsername(String username);
    AppUser loadUserByEmail(String email);
    void addRoleToUserByEmail(String email, String roleName);
    void removeRoleFromUser(String username, String roleName);
    AppUser updateProfile(String email, String firstName, String lastName, String photoUrl);
}
