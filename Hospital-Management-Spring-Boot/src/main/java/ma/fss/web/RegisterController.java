package ma.fss.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import ma.fss.security.entities.AppUser;
import ma.fss.security.entities.UserType;
import ma.fss.security.service.SecurityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class RegisterController {
    private SecurityService securityService;
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AppUser user = securityService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getVerifyPassword(),
                    request.getUserType(),
                    request.getFullName()
            );
            return ResponseEntity.ok(toUserResponse(user));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            String msg = e.getMessage() != null ? e.getMessage() : "Unknown error";
            if (msg.toLowerCase().contains("constraint") || msg.toLowerCase().contains("duplicate")) {
                error.put("error", "Email or username is already taken. Please try another.");
            } else {
                error.put("error", msg);
            }
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ==================== LOGIN ====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AppUser user = securityService.loadUserByEmail(request.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password"));
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password"));
            }

            if (!user.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Account is deactivated"));
            }

            return ResponseEntity.ok(toUserResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication failed"));
        }
    }

    // ==================== GET PROFILE ====================
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        AppUser user = securityService.loadUserByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toUserResponse(user));
    }

    // ==================== UPDATE PROFILE ====================
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        try {
            AppUser user = securityService.updateProfile(
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getPhotoUrl()
            );
            return ResponseEntity.ok(toUserResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== Helper ====================
    private Map<String, Object> toUserResponse(AppUser user) {
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUserId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("userType", user.getUserType() != null ? user.getUserType().name() : null);
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("photoUrl", user.getPhotoUrl());
        response.put("active", user.isActive());
        response.put("hospitalId", user.getHospitalId());
        response.put("doctorId", user.getDoctorId());
        response.put("patientId", user.getPatientId());
        response.put("roles", user.getAppRoles().stream()
                .map(r -> r.getRoleName())
                .collect(Collectors.toList()));
        return response;
    }
}

@Data
class RegisterRequest {
    private String email;
    private String password;
    private String verifyPassword;
    private UserType userType;
    private String fullName;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

@Data
class ProfileUpdateRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String photoUrl;
}
