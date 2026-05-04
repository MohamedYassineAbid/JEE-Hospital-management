package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.security.entities.AppUser;
import ma.fss.security.service.SecurityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private SecurityService securityService;
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Username and password are required"));
        }

        AppUser user = securityService.loadUserByUsername(username);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid username or password"));
        }

        if (!user.isActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Account is disabled"));
        }

        List<String> roles = user.getAppRoles().stream()
                .map(role -> role.getRoleName())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("roles", roles);

        return ResponseEntity.ok(response);
    }
}
