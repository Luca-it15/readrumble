package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.book.BookDAO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;
import it.unipi.dii.aide.lsmd.readrumble.utils.SemaphoreRR;
import org.springframework.scheduling.annotation.Scheduled;

public class MemoryToNeo4j {
    private UserDAO userDAO;
    private BookDAO bookDAO;

    public MemoryToNeo4j() {
        this.userDAO = new UserDAO();
        this.bookDAO = new BookDAO();
    }

    /**
     * This method saves the new follow relations in memory to the graph DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFollowRelations() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        userDAO.saveInMemoryFollowRelations();
        semaphore.release();
    }

    /**
     * This method saves the follow relations to be deleted in memory to the document DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFollowRelationsToBeDeleted() {

        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        userDAO.saveInMemoryFollowRelationsToBeDeleted();
        semaphore.release();
    }

    /**
     * This method saves the favorite books in memory to the graph DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFavoriteBooks() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        bookDAO.saveInMemoryFavoriteBooks();
        semaphore.release();
    }

    /**
     * This method saves the favorite books to be deleted in memory to the document DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFavoriteBooksToBeDeleted() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        bookDAO.saveInMemoryFavoriteBooksToBeDeleted();
        semaphore.release();
    }
}
