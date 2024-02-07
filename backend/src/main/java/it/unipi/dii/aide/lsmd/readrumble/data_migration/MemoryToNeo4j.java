package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.book.BookDAO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;

import org.springframework.scheduling.annotation.Scheduled;

public class MemoryToNeo4j {
    private UserDAO userDAO;
    private BookDAO bookDAO;

    public MemoryToNeo4j() {
        this.userDAO = new UserDAO();
        this.bookDAO = new BookDAO();
    }

    @Scheduled(fixedRate = 3600000) // 1 hour
    public void saveInMemoryData() {
        // This method saves the new follow relations in memory to the graph DB
        userDAO.saveInMemoryFollowRelations();

        // This method saves the follow relations to be deleted in memory to the document DB
        userDAO.saveInMemoryFollowRelationsToBeDeleted();

        // This method saves the favorite books in memory to the graph DB
        bookDAO.saveInMemoryFavoriteBooks();

        // This method saves the favorite books to be deleted in memory to the document DB
        bookDAO.saveInMemoryFavoriteBooksToBeDeleted();
    }
}