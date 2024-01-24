package it.unipi.dii.aide.lsmd.readrumble.book;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import java.util.*;

@RestController
@RequestMapping("/api/book")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {
    private BookDAO bookDAO = new BookDAO();

    private List<LightBookDTO> setResult(List<Document> bookDocuments) {
        List<LightBookDTO> books = new ArrayList<>();
        for (Document doc : bookDocuments) {
            books.add(new LightBookDTO(doc.getLong("id"), doc.getString("title")));
        }
        return books;
    }

    // currentlyReadingBook object that has id, title, bookmark and num_pages
    public class currentlyReadingBook {
        private long id;
        private String title;
        private int bookmark;
        private int num_pages;

        public currentlyReadingBook(long id, String title, int bookmark, int num_pages) {
            this.id = id;
            this.title = title;
            this.bookmark = bookmark;
            this.num_pages = num_pages;
        }

        public long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public int getBookmark() {
            return bookmark;
        }

        public int getNum_pages() {
            return num_pages;
        }
    }

    /**
     * This method returns all the details of a book given its ID
     *
     * @param id of the book
     * @return details of the book
     */
    @GetMapping("/{id}")
    Book getBookDetails(@PathVariable long id) {
        System.out.println("Richiesta libro con id: " + id);

        MongoCollection<Document> BookCollection = MongoConfig.getCollection("Books");
        Document BookDocument = BookCollection.find(new Document("_id", id)).first();

        if (BookDocument == null) {
            System.out.println("Book not found");
            return null;
        } else {
            Book book = new Book(BookDocument.getLong("_id"),
                    BookDocument.getString("isbn"),
                    BookDocument.getString("description"),
                    BookDocument.getString("link"),
                    BookDocument.getList("authors", String.class),
                    BookDocument.getString("publisher"),
                    BookDocument.getInteger("num_pages"),
                    BookDocument.getInteger("publication_year"),
                    BookDocument.getString("url"),
                    BookDocument.getString("image_url"),
                    BookDocument.getString("title"),
                    BookDocument.getList("tags", String.class));

            System.out.println(book);

            return book;
        }
    }

    /**
     * This method returns the last 10 books read by a user
     *
     * @param username of the user
     * @return details of the book
     */
    @GetMapping("/recentlyReadBooks/{username}")
    List<LightBookDTO> getRecentlyReadBooks(@PathVariable String username) {
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
            List<LightBookDTO> books = setResult(BookDocuments);

            System.out.println(books);

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
    public List<currentlyReadingBook> getCurrentlyReadingBooks(@PathVariable String username) {
        System.out.println("Richiesta libri attualmente letti da: " + username);

        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("ActiveBooks");

        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$project", new Document("books", new Document("$filter", new Document("input", "$books").append("as", "book").append("cond", new Document("$eq", List.of("$$book.state", 0)))))),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title").append("bookmark", "$books.bookmark").append("num_pages", "$books.num_pages")),
                new Document("$limit", 10)
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User never read a book");
            return null;
        } else {
            List<currentlyReadingBook> books = new ArrayList<>();
            for (Document doc : BookDocuments) {
                books.add(new currentlyReadingBook(
                        doc.getLong("id"),
                        doc.getString("title"),
                        doc.getInteger("bookmark"),
                        doc.getInteger("num_pages")
                ));
            }
            System.out.println(books);

            return books;
        }
    }

    /**
     * This method returns the wishlist of a user
     *
     * @param username of the user
     * @return id and title of the book
     */
    @GetMapping("/wishlist/{username}")
    public List<LightBookDTO> getWishlist(@PathVariable String username) {
        return bookDAO.getWishlist(username);
    }

    /**
     * This method adds a book to the wishlist of a user
     *
     * @param username of the user
     * @param bookId of the book
     * @return response
     */
    @PostMapping("/addToWishlist/{username}/{bookId}")
    public ResponseEntity<String> addToWishlist(@PathVariable String username, @PathVariable Long bookId, @RequestBody WishlistBookDTO book) {
        return bookDAO.addToWishlist(username, bookId, book);
    }

    /**
     * This method removes a book from the wishlist of a user
     *
     * @param username of the user
     * @return response
     */
    @DeleteMapping("/removeFromWishlist/{username}/{bookId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable String username, @PathVariable Long bookId) {
        return bookDAO.removeFromWishlist(username, bookId);
    }

    /**
     * This method returns the trending books of this month
     *
     * @return id and title of the book
     */
    @GetMapping("/trending")
    List<LightBookDTO> getTrending() {
        return bookDAO.getTrending();
    }

    /**
     * This method returns the books recently read by the friends of a user
     *
     * @param usernames of the friends
     * @return id and title of the book
     */
    @GetMapping("/friendsRecentlyReadBooks")
    List<LightBookDTO> getFriendsRecentlyReadBooks(@RequestParam String usernames) {
        return bookDAO.getFriendsRecentlyReadBooks(usernames);
    }

    /**
     * This method returns the pages read by a user grouped by tag
     *
     * @param username of the user
     * @return list of tag and pages
     */
    @GetMapping("/pagesReadByTag/{username}")
    List<Document> getPagesReadByTag(@PathVariable String username) {
        return bookDAO.getPagesReadByTag(username);
    }

}
