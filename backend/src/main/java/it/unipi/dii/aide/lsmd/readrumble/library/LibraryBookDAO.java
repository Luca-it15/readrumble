package it.unipi.dii.aide.lsmd.readrumble.library;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;


public class LibraryBookDAO {

    private static List<LibraryBookDAO> activeBooks;
    List<LibraryBookDTO> getLibraryBooks(String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Active_books");
        Document query = new Document("username", username);
        Document userDocument = collection.find(query).first();
        List<LibraryBookDTO> libraryBooks = new ArrayList<>();
        if (userDocument != null) {
            List<Document> books = (List<Document>) userDocument.get("books");
            for (Document book : books) {
                LibraryBookDTO lb = new LibraryBookDTO(
                        book.getString("book_name")
                );
                List<String> arrayTags = (List<String>) book.get("tags");
                lb.setTags(arrayTags);
                libraryBooks.add(lb);
            }
        }
        MongoConfig.closeConnection();
        return libraryBooks;
    }
}