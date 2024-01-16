package it.unipi.dii.aide.lsmd.readrumble.library;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;


public class ActiveBookDAO {

    List<LibraryBookDTO> getActiveBooks(String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Active_books");
        Document query = new Document("username", username);
        Document userDocument = collection.find(query).first();
        List<LibraryBookDTO> activeBooks = new ArrayList<>();
        if (userDocument != null) {
            List<Document> books = (List<Document>) userDocument.get("books");
            for (Document book : books) {
               LibraryBookDTO lb = new LibraryBookDTO(
                   book.getString("title")
                );
                List<String> arrayTags = (List<String>)book.get("tags");
                lb.setTags(arrayTags);
            }

        }
        MongoConfig.closeConnection();
        return activeBooks;
    }
    
}