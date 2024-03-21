package it.unipi.dii.aide.lsmd.readrumble.book;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.web.CrossOriginConfig;

import com.mongodb.client.MongoCollection;

import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/book")
@CrossOrigin(origins = CrossOriginConfig.origin)
public class BookController {
    private final BookDAO bookDAO = new BookDAO();


    /**
     * This method turns a list of books' documents into a list of books
     *
     * @param bookDocuments the list of books
     * @return list of books
     */
    public static List<LightBookDTO> setResult(List<Document> bookDocuments) {
        List<LightBookDTO> books = new ArrayList<>();
        for (Document doc : bookDocuments) {
            books.add(new LightBookDTO(doc.getLong("id"), doc.getString("title")));
        }
        return books;
    }

    /**
     * This method returns all the details of a book given its ID
     *
     * @param id of the book
     * @return details of the book
     */
    @GetMapping("/{id}")
    Book getBookDetails(@PathVariable long id) {
        MongoCollection<Document> BookCollection = MongoConfig.getCollection("Books");
        Document BookDocument = BookCollection.find(new Document("_id", id)).first();

        if (BookDocument == null) {
            return null;
        } else {
            return new Book(BookDocument.getLong("_id"),
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
        }
    }

    /**
     * This method returns the last 10 books read by a user in the last 6 months
     *
     * @param username of the user
     * @return details of the book
     */
    @GetMapping("/recentlyReadBooks/{username}")
    List<LightBookDTO> getRecentlyReadBooks(@PathVariable String username) {
        MongoCollection<Document> UsersCollection = MongoConfig.getCollection("Users");

        List<Document> BookDocuments = UsersCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$recent_active_books"),
                new Document("$sort", new Document("year", -1L).append("month", -1L)),
                new Document("$project", new Document("finished_books", new Document("$filter",
                        new Document("input", "$recent_active_books.books").append("as", "book")
                                .append("cond", new Document("$eq", Arrays.asList("$$book.bookmark", "$$book.num_pages")))))),
                new Document("$unwind", "$finished_books"),
                new Document("$limit", 10L),
                new Document("$project", new Document("id", "$finished_books.book_id").append("title", "$finished_books.book_title"))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            return null;
        } else {
            return setResult(BookDocuments);
        }
    }

    /**
     * This method returns the first 10 books that the user is reading
     *
     * @param username of the user
     * @return details of the book
     */
    @GetMapping("/currentlyReadingBooks/{username}")
    public List<ActiveBookDTO> getCurrentlyReadingBooks(@PathVariable String username) {
        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("Users");

        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$recent_active_books"),
                new Document("$sort", new Document("year", -1L).append("month", -1L)),
                new Document("$limit", 1L),
                new Document("$project", new Document("bookmark_different_num_pages", new Document("$filter",
                        new Document("input", "$recent_active_books.books").append("as", "book")
                                .append("cond", new Document("$ne", Arrays.asList("$$book.bookmark", "$$book.num_pages")))))),
                new Document("$unwind", "$bookmark_different_num_pages")
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            return null;
        } else {
            List<ActiveBookDTO> books = new ArrayList<>();
            for (Document doc : BookDocuments) {
                Document bookDoc = (Document) doc.get("bookmark_different_num_pages");
                if (bookDoc != null) {
                    Long id = bookDoc.getLong("book_id");
                    String title = bookDoc.getString("book_title");
                    List<String> tags = bookDoc.getList("tags", String.class);
                    Integer bookmark = bookDoc.getInteger("bookmark");
                    Integer num_pages = bookDoc.getInteger("num_pages");

                    if (id != null && title != null && tags != null && bookmark != null && num_pages != null) {
                        books.add(new ActiveBookDTO(
                                id,
                                title,
                                tags,
                                bookmark,
                                num_pages));
                    }
                }
            }

            return books;
        }
    }

    /**
     * This method adds a book to the list of active books of a user
     *
     * @param username of the user
     * @param book     the book to be added
     *
     * @return a ResponseEntity with the result of the operation
     */
    @PostMapping("/startReading/{username}/{book_id}")
    public ResponseEntity<String> startReading(@PathVariable String username, @PathVariable Long book_id, @RequestBody ActiveBookDTO book) {
        return bookDAO.startReading(username, book_id, book);
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
     * @param bookId   of the book
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
     * @param username of the user
     * @return id and title of the book
     */
    @GetMapping("/friendsRecentlyReadBooks/{username}")
    List<LightBookDTO> getFriendsRecentlyReadBooks(@PathVariable String username) {
        return bookDAO.getFriendsRecentlyReadBooks(username);
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

    /**
     * This method returns the suggested books for a user, based on the books that his friends like.
     * If the majority of the friends like a book, and the user does not like it, then the book is suggested.
     *
     * @param username the username of the user
     * @return the list of suggested books
     */
    @GetMapping("/suggestedBooks/{username}")
    List<LightBookDTO> getSuggestedBooks(@PathVariable String username) {
        return bookDAO.getSuggestedBooks(username);
    }

    /**
     * This method removes a book from the favorite books of a user
     *
     * @param username the username of the user
     * @param book     the id of the book
     * @return a ResponseEntity with the result of the operation
     */
    @DeleteMapping("/removeFavoriteBook/{username}/{book}")
    public ResponseEntity<String> removeFavoriteBook(@PathVariable String username, @PathVariable String book) {
        return bookDAO.removeFavoriteBook(username, book);
    }

    /**
     * This method adds a book to the favorite books of a user
     *
     * @param username the username of the user
     * @param book     the id of the book
     * @return a ResponseEntity with the result of the operation
     */
    @PostMapping("/addFavoriteBook/{username}/{book}")
    public ResponseEntity<String> addFavoriteBook(@PathVariable String username, @PathVariable String book) {
        return bookDAO.addFavoriteBook(username, book);
    }

    /**
     * This method returns the favorite books of a user
     *
     * @param username the username of the user
     * @return the list of favorite books
     */
    @GetMapping("/favoriteBooks/{username}")
    public List<LightBookDTO> getFavoriteBooks(@PathVariable String username) {
        return bookDAO.getFavoriteBooks(username);
    }

    /**
     * This analytics method returns the monthly number of pages read by the user in the last six month
     *
     * @param username the username of the user
     * @return dates and pages read
     */
    @GetMapping("/analytics/pagesTrend/{username}")
    public List<Document> getPagesTrend(@PathVariable String username) {
        return bookDAO.getPagesTrend(username);
    }
}