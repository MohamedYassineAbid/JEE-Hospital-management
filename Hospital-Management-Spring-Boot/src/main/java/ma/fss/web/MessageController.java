package ma.fss.web;

import lombok.AllArgsConstructor;
import ma.fss.entities.Message;
import ma.fss.entities.Appointment;
import ma.fss.repositories.MessageRepository;
import ma.fss.repositories.AppointmentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/messages")
public class MessageController {

    private MessageRepository messageRepository;
    private AppointmentRepository appointmentRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message msg) {
        // 🛡️ The Follow-up Check
        // A Patient can only message a Doctor if they have an appointment
        boolean canMessage = appointmentRepository.findByPatientUsername(msg.getSenderUsername(), PageRequest.of(0, 100))
                .getContent().stream()
                .anyMatch(appt -> appt.getDoctor().getUsername().equals(msg.getReceiverUsername()));

        // If the sender is a Doctor, we check if the receiver is their patient
        if (!canMessage) {
            canMessage = appointmentRepository.findByDoctorUsername(msg.getSenderUsername(), PageRequest.of(0, 100))
                    .getContent().stream()
                    .anyMatch(appt -> appt.getPatient().getUsername().equals(msg.getReceiverUsername()));
        }

        if (!canMessage) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.singletonMap("error", "You can only message doctors/patients you have had appointments with."));
        }

        msg.setTimestamp(new Date());
        msg.setSeen(false);
        return ResponseEntity.ok(messageRepository.save(msg));
    }

    @GetMapping("/conversation")
    public List<Message> getConversation(@RequestParam String u1, @RequestParam String u2) {
        return messageRepository.findConversation(u1, u2);
    }

    @GetMapping("/unread")
    public List<Message> getUnread(@RequestParam String username) {
        return messageRepository.findByReceiverUsernameAndSeenFalse(username);
    }

    @PostMapping("/mark-read")
    public void markRead(@RequestParam String sender, @RequestParam String receiver) {
        List<Message> unread = messageRepository.findBySenderUsernameAndReceiverUsernameAndSeenFalse(sender, receiver);
        unread.forEach(m -> m.setSeen(true));
        messageRepository.saveAll(unread);
    }
}
