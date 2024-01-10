package it.unipi.dii.aide.lsmd.readrumble.library;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;


public class ActiveBookDAO {
    List<ActiveBookDTO> getActiveBooks(String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Active_books");
        Document query = new Document("username", username);
        Document userDocument = collection.find(query).first();
        List<ActiveBookDTO> activeBooks = new ArrayList<ActiveBookDTO>();
        if (userDocument != null) {
            List<Document> books = (List<Document>) userDocument.get("books");
            for (Document book : books) {
                ActiveBookDTO activeBook = new ActiveBookDTO(book.getString("book_name"));
                activeBooks.add(activeBook);
            }

        }
        MongoConfig.closeConnection();
        return activeBooks;
    }
}