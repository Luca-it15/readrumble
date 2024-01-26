package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.book.BookDAO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;
import org.springframework.scheduling.annotation.Scheduled;

public class MemoryToNeo4j {
    private final UserDAO userDAO;
    private final BookDAO bookDAO;

    public MemoryToNeo4j() {
        this.userDAO = new UserDAO();
        this.bookDAO = new BookDAO();
    }

    /**
     * This method saves the new follow relations in memory to the graph DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFollowRelations() {
        userDAO.saveInMemoryFollowRelations();
    }

    /**
     * This method saves the follow relations to be deleted in memory to the document DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFollowRelationsToBeDeleted() {
        userDAO.saveInMemoryFollowRelationsToBeDeleted();
    }

    /**
     * This method saves the favorite books in memory to the graph DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFavoriteBooks() {
        bookDAO.saveInMemoryFavoriteBooks();
    }

    /**
     * This method saves the favorite books to be deleted in memory to the document DB every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryFavoriteBooksToBeDeleted() {
        bookDAO.saveInMemoryFavoriteBooksToBeDeleted();
    }
}
