package it.unipi.dii.aide.lsmd.readrumble.book;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/book")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {
    private final BookDAO bookDAO = new BookDAO();

    private List<LightBookDTO> setResult(List<Document> bookDocuments) {
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
    public List<ActiveBookDTO> getCurrentlyReadingBooks(@PathVariable String username) {
        System.out.println("Richiesta libri attualmente letti da: " + username);

        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("ActiveBooks");

        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$limit", 1),
                new Document("$project", new Document("books", new Document("$filter", new Document("input", "$books").append("as", "book").append("cond", new Document("$eq", List.of("$$book.state", 0)))))),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title").append("tags", "$books.tags").append("bookmark", "$books.bookmark").append("num_pages", "$books.num_pages"))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User never read a book");
            return null;
        } else {
            List<ActiveBookDTO> books = new ArrayList<>();
            for (Document doc : BookDocuments) {
                books.add(new ActiveBookDTO(
                        doc.getLong("id"),
                        doc.getString("title"),
                        doc.getList("tags", String.class),
                        doc.getInteger("bookmark"),
                        doc.getInteger("num_pages")));
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
}
