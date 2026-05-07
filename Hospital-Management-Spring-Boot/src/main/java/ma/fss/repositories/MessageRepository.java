package ma.fss.repositories;

import ma.fss.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderUsername = :u1 AND m.receiverUsername = :u2) OR " +
           "(m.senderUsername = :u2 AND m.receiverUsername = :u1) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("u1") String u1, @Param("u2") String u2);
    
    List<Message> findByReceiverUsernameAndSeenFalse(String receiverUsername);
    List<Message> findBySenderUsernameAndReceiverUsernameAndSeenFalse(String senderUsername, String receiverUsername);

    @Query(value = "SELECT COUNT(DISTINCT user_id) FROM (" +
           "  SELECT sender_username as user_id FROM message WHERE receiver_username = :username " +
           "  UNION " +
           "  SELECT receiver_username as user_id FROM message WHERE sender_username = :username" +
           ") as contacts", nativeQuery = true)
    long countUniqueContacts(@Param("username") String username);
}
