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

    // lightBook object that only has id and title
    private class lightBook {
        private int id;
        private String title;

        public lightBook(int id, String title) {
            this.id = id;
            this.title = title;
        }

        public int getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }
    }

    private List<lightBook> setResult(List<Document> bookDocuments) {
        List<lightBook> books = new ArrayList<>();
        for (Document doc : bookDocuments) {
            books.add(new lightBook(doc.getInteger("id"), doc.getString("title")));
        }
        return books;
    }

    // currentlyReadingBook object that has id, title, bookmark and num_pages
    private class currentlyReadingBook {
        private int id;
        private String title;
        private int bookmark;
        private int num_pages;

        public currentlyReadingBook(int id, String title, int bookmark, int num_pages) {
            this.id = id;
            this.title = title;
            this.bookmark = bookmark;
            this.num_pages = num_pages;
        }

        public int getId() {
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
    Book getBookDetails(@PathVariable int id) {
        System.out.println("Richiesta libro con id: " + id);

        MongoCollection<Document> BookCollection = MongoConfig.getCollection("Books");
        Document BookDocument = BookCollection.find(new Document("_id", id)).first();

        if (BookDocument == null) {
            System.out.println("Book not found");
            return null;
        } else {
            Book book = new Book(BookDocument.getInteger("_id"),
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
    List<lightBook> getRecentlyReadBooks(@PathVariable String username) {
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
            List<lightBook> books = setResult(BookDocuments);

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
    List<currentlyReadingBook> getCurrentlyReadingBooks(@PathVariable String username) {
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
                        doc.getInteger("id"),
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
    List<lightBook> getWishlist(@PathVariable String username) {
        System.out.println("Richiesta wishlist di: " + username);

        MongoCollection<Document> WishlistCollection = MongoConfig.getCollection("Wishlists");

        List<Document> BookDocuments = WishlistCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title"))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User has no wishlist");
            return null;
        } else {
            List<lightBook> books = setResult(BookDocuments);

            System.out.println(books);

            return books;
        }
    }

    /**
     * This method adds a book to the wishlist of a user
     *
     * @param username of the user
     * @param bookId   of the book
     * @return id and title of the book
     */
    @PostMapping("/addToWishlist/{username}/{bookId}")
    public ResponseEntity<String> addToWishlist(@PathVariable String username, @PathVariable int bookId) {
        System.out.println("Richiesta aggiunta libro " + bookId + " alla wishlist di: " + username);

        MongoCollection<Document> WishlistCollection = MongoConfig.getCollection("Wishlists");

        // Add the book to the wishlist
        WishlistCollection.updateOne(new Document("_id", username),
                new Document("$addToSet", new Document("books", new Document("book_id", bookId).append("book_title", getBookDetails(bookId).getTitle()))));

        // Get the wishlist
        List<Document> BookDocuments = WishlistCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title"))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.print("User has no wishlist");
            return null;
        } else {
            return ResponseEntity.ok().body("Book added to wishlist");
        }
    }

    /**
     * This method removes a book from the wishlist of a user
     *
     * @param username of the user
     * @param bookId   of the book
     * @return id and title of the book
     */
    @DeleteMapping("/removeFromWishlist/{username}/{bookId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable String username, @PathVariable int bookId) {
        System.out.println("Richiesta rimozione libro " + bookId + " dalla wishlist di: " + username);

        MongoCollection<Document> WishlistCollection = MongoConfig.getCollection("Wishlists");

        // Remove the book from the wishlist
        WishlistCollection.updateOne(new Document("_id", username),
                new Document("$pull", new Document("books", new Document("book_id", bookId).append("book_title", getBookDetails(bookId).getTitle()))));

        // Get the wishlist
        List<Document> BookDocuments = WishlistCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title"))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User has no wishlist");
            return null;
        } else {
            return ResponseEntity.ok().body("Book removed from wishlist");
        }
    }

    /**
     * This method returns the first 10 books in the global ranking
     *
     * @return id and title of the book
     */
    @GetMapping("/trending")
    List<lightBook> getTrending() {
        MongoCollection<Document> Posts = MongoConfig.getCollection("Posts");

        Date thirtyDaysAgo = new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000);

        List<Document> result = Posts.aggregate(List.of(
                new Document("$match", new Document("rating", new Document("$gte", 1)).append("date_added", new Document("$gte", thirtyDaysAgo))),
                new Document("$group", new Document("_id", "$book_id")
                        .append("book_title", new Document("$first", "$book_title"))
                        .append("count", new Document("$sum", 1))
                        .append("average_rating", new Document("$avg", "$rating"))),
                new Document("$sort", new Document("count", -1))
        )).into(new ArrayList<>());

        int maxCount = result.getFirst().getInteger("count");

        for (Document doc : result) {
            int count = doc.getInteger("count");
            double score = 0;
            if (count != 0) {
                double avgRating = doc.getDouble("average_rating");
                double normalizedCount = (count - 1.0) / (maxCount - 1.0) * (5 - 1.0) + 1;
                double x = (1.3 * avgRating) + (0.7 * normalizedCount);
                score = 1.0 / (1 + Math.exp(-(x - 3)));
            }
            doc.append("score", score);
        }

        result.sort((o1, o2) -> Double.compare(o2.getDouble("score"), o1.getDouble("score")));

        result = result.subList(0, Math.min(10, result.size()));

        System.out.println(result);

        List<lightBook> trendingBooks = new ArrayList<>();
        for (Document doc : result) {
            trendingBooks.add(new lightBook(doc.getInteger("_id"), doc.getString("book_title")));
        }

        return trendingBooks;
    }

    /**
     * This method returns the last 10 books finished by a user's friends
     *
     * @param usernames of the user's friends
     * @return id and title of the book
     */
    @GetMapping("/friendsRecentlyReadBooks")
    List<lightBook> getFriendsRecentlyReadBooks(@RequestParam String usernames) {
        System.out.println("Richiesta libri recentemente letti dagli amici");

        if (usernames.isEmpty()) {
            System.out.println("User has no friends");
            return null;
        }
        
        List<String> usernameList = Arrays.asList(usernames.split(","));

        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("ActiveBooks");

        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("username", new Document("$in", usernameList))),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$limit", usernames.length()),
                new Document("$project", new Document("books", new Document("$filter", new Document("input", "$books").append("as", "book").append("cond", new Document("$eq", List.of("$$book.state", 1)))))),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title")),
                new Document("$limit", 10)
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User's friends never read a book");
            return null;
        } else {
            List<lightBook> books = setResult(BookDocuments);

            System.out.println(books);

            return books;
        }
    }

    /**
     * This method returns the pages_read for each tag of the books read by the user
     *
     * @param username of the user
     * @return id and title of the book
     */
    @GetMapping("/pagesReadByTag/{username}")
    List<Document> getPagesReadByTag(@PathVariable String username) {
        System.out.println("Richiesta pagine lette per ogni tag da: " + username);

        MongoCollection<Document> ActiveBooksCollection = MongoConfig.getCollection("ActiveBooks");

        List<Document> BookDocuments = ActiveBooksCollection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$limit", 6),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("id", "$books.book_id").append("title", "$books.book_title").append("tags", "$books.tags").append("pages_read", "$books.pages_read")),
                new Document("$unwind", "$tags"),
                new Document("$group", new Document("_id", "$tags").append("pages_read", new Document("$sum", "$pages_read"))),
                new Document("$sort", new Document("_id", 1))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            System.out.println("User never read a book");
            return null;
        } else {
            System.out.println(BookDocuments);

            return BookDocuments;
        }
    }
}
