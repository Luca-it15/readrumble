package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.admin.AdminBookDAO;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionDAO;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionDTO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;

import org.bson.Document;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class MemoryToMongo {
    private UserDAO userDAO;
    private AdminCompetitionDAO adminCompetitionDAO;
    private AdminBookDAO adminBookDAO;

    public MemoryToMongo() {
        this.userDAO = new UserDAO();
        this.adminCompetitionDAO = new AdminCompetitionDAO();
        this.adminBookDAO = new AdminBookDAO();

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        long initialDelay = LocalTime.now().until(LocalTime.MIDNIGHT, ChronoUnit.MINUTES);
        long period = 24 * 60;

        scheduler.scheduleAtFixedRate(new HandlerBookAdmin(), initialDelay, period, TimeUnit.MINUTES);
    }

    /**
     * This method saves the users in memory to the document DB and graph DB every hour
     */
    @Scheduled(fixedRate = 3600000, initialDelay =3600000 ) // 1 hour
    public void saveInMemoryUsersAndUpdateChanges() {
        userDAO.saveInMemoryUsers();
        userDAO.updateChanges();
    }

    @Scheduled(fixedRate = 86400000, initialDelay = 3600000) // 24 hours in milliseconds
    public void insertNewCompetitionsIntoMongoDB() {
        adminCompetitionDAO.saveInMemoryCompetitions();
    }

    public class HandlerBookAdmin implements Runnable {
        @Override
        public void run() {
            adminBookDAO.addBook();
            adminBookDAO.updateBook();
            adminBookDAO.removeBook();
        }
    }
}
