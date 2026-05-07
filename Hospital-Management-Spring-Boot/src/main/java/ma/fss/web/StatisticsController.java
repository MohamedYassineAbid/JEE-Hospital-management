package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.service.IHospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@AllArgsConstructor
public class StatisticsController {

    private IHospitalService hospitalService;

    @GetMapping("/doctor")
    public ResponseEntity<Map<String, Object>> getDoctorStats(@RequestParam String username) {
        return ResponseEntity.ok(hospitalService.getDoctorStats(username));
    }

    @GetMapping("/patient")
    public ResponseEntity<Map<String, Object>> getPatientStats(@RequestParam String username) {
        return ResponseEntity.ok(hospitalService.getPatientStats(username));
    }
}
