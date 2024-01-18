package it.unipi.dii.aide.lsmd.readrumble.book;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/book")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    /**
     * This method returns all the details of a book given its ID
     *
     * @param id of the book
     * @return details of the book
     */
    @GetMapping("/{id}")
    Document getBookDetails(@PathVariable int id) {
        System.out.println("Richiesta libro con id: " + id);

        MongoCollection<Document> BookCollection = MongoConfig.getCollection("Books");
        Document BookDocument = BookCollection.find(new Document("_id", id)).first();

        if (BookDocument == null) {
            System.out.println("Book not found");
            return null;
        } else {
            System.out.println(BookDocument.toJson());
            return BookDocument;
        }
    }

    /**
     * This method returns the last 10 books read by a user
     *
     * @param username of the user
     * @return details of the book
     */
    @GetMapping("/recentlyReadBooks/{username}")
    List<Map<String, Object>> getRecentlyReadBooks(@PathVariable String username) {
        System.out.println("Richiesta libri recentemente letti da: " + username);

        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("ActiveBooks");

        // Get the documents with "username" = username, then sort by year and month, then take the books.book_id and books.title of the documents in the arrays "books" with state = 1
        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$project", new Document("books", new Document("$filter", new Document("input", "$books").append("as", "book").append("cond", new Document("$eq", List.of("$$book.state", 1)))))),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title")),
                new Document("$limit", 10)
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User never read a book");
            return null;
        } else {
            List<Map<String, Object>> books = new ArrayList<>();
            for (Document doc : BookDocuments) {
                Map<String, Object> book = new HashMap<>();
                book.put("id", doc.get("id"));
                book.put("title", doc.get("title"));
                books.add(book);
            }
            return books;
        }
    }

    /**
     * This method returns the first 10 books that the user is reading
     *
     * @param username of the user
     * @return details of the book
     */
    @GetMapping("/currentlyReadingBooks/{username}")
    List<Map<String, Object>> getCurrentlyReadingBooks(@PathVariable String username) {
        System.out.println("Richiesta libri attualmente letti da: " + username);

        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("ActiveBooks");

        // Get the documents with "username" = username, then sort by year and month, then take the books.book_id and books.title of the documents in the arrays "books" with state = 1
        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$project", new Document("books", new Document("$filter", new Document("input", "$books").append("as", "book").append("cond", new Document("$eq", List.of("$$book.state", 0)))))),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title")),
                new Document("$limit", 10)
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User never read a book");
            return null;
        } else {
            List<Map<String, Object>> books = new ArrayList<>();
            for (Document doc : BookDocuments) {
                Map<String, Object> book = new HashMap<>();
                book.put("id", doc.get("id"));
                book.put("title", doc.get("title"));
                books.add(book);
            }
            return books;
        }
    }
}
