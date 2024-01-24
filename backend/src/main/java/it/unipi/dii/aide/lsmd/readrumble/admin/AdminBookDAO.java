package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import org.bson.Document;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.book.Book;

import java.time.Instant;

public class AdminBookDAO {
    public String removeBook(long id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Books");
        Document query = new Document("_id", id);
        Document target = collection.find(query).first();
        if(target != null) {
            collection.deleteOne(target);
            return "book successful remove";
        } else
            return "failed to remove the book";
    }

    public String addBook(Book book) {

        MongoCollection<Document> collection = MongoConfig.getCollection("Books");

        Instant instant = Instant.now();
        long timestamp = instant.toEpochMilli();
          Document document = new Document("_id", timestamp)
                    .append("isbn", book.getIsbn())
                    .append("description", book.getDescription())
                    .append("link", book.getLink())
                    .append("authors", book.getAuthors())
                    .append("publisher", book.getPublisher())
                    .append("num_pages", book.getNum_pages())
                    .append("publication_year", book.getPublication_year())
                    .append("url", book.getUrl())
                    .append("image_url", book.getImage_url())
                    .append("title", book.getTitle())
                    .append("tags", book.getTags());
            collection.insertOne(document);

            return "successful addition";
        }
}
