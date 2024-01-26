package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MemoryToMongo {

    private final UserDAO userDAO;

    public MemoryToMongo() {
        this.userDAO = new UserDAO();
    }

    /**
     * This method saves the users in memory to the document DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryUsers() {
        userDAO.saveInMemoryUsers();
    }
}
