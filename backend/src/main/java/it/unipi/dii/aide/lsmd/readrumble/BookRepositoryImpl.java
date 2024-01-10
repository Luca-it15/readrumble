package it.unipi.dii.aide.lsmd.readrumble;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.bean.Book;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class BookRepositoryImpl {
    public List<Book> findByTitleContainingIgnoreCase(String title) {
        List<Book> matchingBooks = new ArrayList<>();

        // Replace "books" with your MongoDB collection name
        MongoCollection<Document> collection = MongoConfig.getCollection("Book_sub");

        // Create a case-insensitive regex pattern for the title
        org.bson.Document regexQuery = new org.bson.Document("title", new org.bson.Document("$regex", title).append("$options", "i"));

        // Find documents that match the regex query
        FindIterable<Document> result = collection.find(regexQuery);

        try (MongoCursor<Document> cursor = result.iterator()) {
            while (cursor.hasNext()) {
                org.bson.Document document = cursor.next();
                Book book = new Book();
                book.setId(document.getObjectId("_id").toString());
                book.setTitle(document.getString("title"));
                System.out.println("title " + book.getTitle());
                // Set other properties as needed
                matchingBooks.add(book);
            }
        }

        return matchingBooks;
    }
}
