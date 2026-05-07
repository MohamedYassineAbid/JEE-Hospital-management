package ma.fss.web;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.AllArgsConstructor;
import ma.fss.entities.Doctor;
import ma.fss.entities.Patient;
import ma.fss.repositories.DoctorRepository;
import ma.fss.repositories.PatientRepository;
import ma.fss.security.JWTUtils;
import ma.fss.security.entities.AppUser;
import ma.fss.security.entities.DoctorKey;
import ma.fss.security.repositories.DoctorKeyRepository;
import ma.fss.security.service.SecurityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private SecurityService securityService;
    private PasswordEncoder passwordEncoder;
    private PatientRepository patientRepository;
    private DoctorRepository doctorRepository;
    private DoctorKeyRepository doctorKeyRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        AppUser user = securityService.loadAppUserByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid credentials"));
        }

        List<String> roles = user.getAppRoles().stream().map(role -> role.getRoleName()).collect(Collectors.toList());
        Algorithm algorithm = Algorithm.HMAC256(JWTUtils.SECRET);
        String jwtAccessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + JWTUtils.EXPIRE_ACCESS_TOKEN))
                .withClaim("roles", roles)
                .sign(algorithm);

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("roles", roles);
        response.put("accessToken", jwtAccessToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        String confirmPassword = data.get("confirmPassword");
        String role = data.get("role");
        String secretKey = data.get("secretKey");

        // Basic Validation
        if (username == null || password == null || !password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Validation failed"));
        }

        // Check if user already exists
        AppUser existingUser = securityService.loadAppUserByUsername(username);
        
        if (existingUser != null) {
            // If it's a doctor, we allow them to "re-register" to repair their profile
            boolean isDoctor = existingUser.getAppRoles().stream().anyMatch(r -> r.getRoleName().equals("DOCTOR"));
            if (!isDoctor || !"DOCTOR".equals(role)) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Username already taken"));
            }
        } else {
            // New User flow
            if (password == null || !password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Passwords do not match"));
            }
            
            if ("PATIENT".equals(role) && patientRepository.findByCin(data.get("cin")) != null) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "CIN already registered"));
            }

            // Doctor Specific Verification
            if ("DOCTOR".equals(role)) {
                if (secretKey == null) return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Secret Key required for Doctors"));
                
                Optional<DoctorKey> keyOpt = doctorKeyRepository.findBySecretKey(secretKey);
                if (!keyOpt.isPresent() || keyOpt.get().isUsed()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid or used Secret Key"));
                }
                
                DoctorKey key = keyOpt.get();
                key.setUsed(true);
                key.setAssignedTo(username);
                doctorKeyRepository.save(key);
            }

            try {
                securityService.saveNewUserWithRole(username, password, confirmPassword, role);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", e.getMessage()));
            }
        }

        // Profile Initialization / Repair Logic
        try {
            if ("DOCTOR".equals(role)) {
                Doctor doc = doctorRepository.findByUsername(username).orElse(new Doctor());
                doc.setUsername(username);
                doc.setName(data.getOrDefault("name", username));
                doc.setEmail(data.get("email"));
                doc.setSpecialty(data.get("specialty"));
                doc.setWorkContact(data.get("workContact"));
                doc.setDayOff(data.getOrDefault("dayOff", "SUNDAY").toUpperCase());
                
                int mCap = Integer.parseInt(data.getOrDefault("morningCapacity", "5"));
                int aCap = Integer.parseInt(data.getOrDefault("afternoonCapacity", "3"));
                doc.setMorningCapacity(mCap > 0 ? mCap : 5);
                doc.setAfternoonCapacity(aCap > 0 ? aCap : 3);
                
                doctorRepository.save(doc);
            } else {
                Patient pat = patientRepository.findByUsername(username).orElse(new Patient());
                pat.setUsername(username);
                pat.setName(data.getOrDefault("name", username));
                pat.setCin(data.get("cin"));
                pat.setBirthDate(new Date());
                patientRepository.save(pat);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(Collections.singletonMap("message", "Registration successful (Profile Updated)"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Profile error: " + e.getMessage()));
        }
    }
}
