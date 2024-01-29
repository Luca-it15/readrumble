package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionDAO;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MemoryToMongo {
    private UserDAO userDAO;
    private AdminCompetitionDAO adminCompetitionDAO;
    public MemoryToMongo() {
        this.userDAO = new UserDAO();
        this.adminCompetitionDAO = new AdminCompetitionDAO();
    }

    /**
     * This method saves the users in memory to the document DB every hour
     */
    @Scheduled(fixedRate = 3600000, initialDelay =3600000 ) // 1 hour
    public void saveInMemoryUsers() {
        userDAO.saveInMemoryUsers();
    }
    @Scheduled(fixedRate =  86400000, initialDelay =3600000) // 24 hours in milliseconds
    public void insertNewCompetitionsIntoMongoDB() {
        adminCompetitionDAO.saveInMemoryCompetitions();
    }
}
