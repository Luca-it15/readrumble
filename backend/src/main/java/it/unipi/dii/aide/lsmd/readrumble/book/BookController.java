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

    private List<LightBookDTO> setResult(List<Document> bookDocuments) {
        List<LightBookDTO> books = new ArrayList<>();
        for (Document doc : bookDocuments) {
            books.add(new LightBookDTO(doc.getLong("id"), doc.getString("title")));
        }
        return books;
    }

    // currentlyReadingBook object that has id, title, bookmark and num_pages
    private class currentlyReadingBook {
        private Long id;
        private String title;
        private int bookmark;
        private int num_pages;

        public currentlyReadingBook(Long id, String title, int bookmark, int num_pages) {
            this.id = id;
            this.title = title;
            this.bookmark = bookmark;
            this.num_pages = num_pages;
        }

        public Long getId() {
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
    Book getBookDetails(@PathVariable Long id) {
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
        Jedis jedis = RedisConfig.getSession();

        // Get all the keys of the wishlist of the user
        Set<String> keys = jedis.keys("wishlist:" + username + ":*");

        if (keys.isEmpty()) {
            // Get the wishlist from MongoDB
            MongoCollection<Document> mongoWishlists = MongoConfig.getCollection("Wishlists");
            Document wishlist = mongoWishlists.find(new Document("_id", username)).first();

            if (wishlist == null) {
                return null;
            }

            List<Document> books = (List<Document>) wishlist.get("books");

            List<LightBookDTO> lightBooks = new ArrayList<>();
            for (Document book : books) {
                lightBooks.add(new LightBookDTO(book.getLong("book_id"), book.getString("book_title")));
            }

            return lightBooks;
        }

        List<LightBookDTO> books = new ArrayList<>();

        // For each key, get the id and title of the book
        for (String key : keys) {
            Map<String, String> book = jedis.hgetAll(key);

            Long bookId = Long.parseLong(key.split(":")[2]);

            books.add(new LightBookDTO(bookId, book.get("book_title")));
        }

        System.out.println(books);

        return books;
    }

    /**
     * This method adds a book to the wishlist of a user
     *
     * @param username of the user
     * @param bookId   of the book
     * @return id and title of the book
     */
    @PostMapping("/addToWishlist/{username}/{bookId}")
    public ResponseEntity<String> addToWishlist(@PathVariable String username, @PathVariable Integer bookId, @RequestBody WishlistBookDTO book) {
        Jedis jedis = RedisConfig.getSession();

        // See if the book is already in the wishlist
        if (jedis.hexists("wishlist:" + username + ":" + bookId, "book_title")) {
            return ResponseEntity.badRequest().body("Book already in wishlist");
        }

        Map<String, String> bookMap = new HashMap<>();
        bookMap.put("book_id", String.valueOf(book.getBook_id()));
        bookMap.put("book_title", book.getBook_title());
        bookMap.put("num_pages", String.valueOf(book.getNum_pages()));
        bookMap.put("tags", String.join(",", book.getTags()));

        jedis.hset("wishlist:" + username + ":" + bookId, bookMap);
        return ResponseEntity.ok("Book added to wishlist");
    }

    /**
     * This method removes a book from the wishlist of a user
     *
     * @param username of the user
     * @param bookId   of the book
     * @return id and title of the book
     */
    @DeleteMapping("/removeFromWishlist/{username}/{bookId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable String username, @PathVariable Integer bookId) {
        Jedis jedis = RedisConfig.getSession();

        // See if the book is not in the wishlist
        if (!jedis.hexists("wishlist:" + username + ":" + bookId, "book_title")) {
            return ResponseEntity.badRequest().body("Book not in wishlist");
        }

        jedis.del("wishlist:" + username + ":" + bookId);
        return ResponseEntity.ok("Book removed from wishlist");
    }

    /**
     * This method returns the first 10 books in the global ranking
     *
     * @return id and title of the book
     */
    @GetMapping("/trending")
    List<LightBookDTO> getTrending() {
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

        List<LightBookDTO> trendingBooks = new ArrayList<>();
        for (Document doc : result) {
            trendingBooks.add(new LightBookDTO(doc.getLong("_id"), doc.getString("book_title")));
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
    List<LightBookDTO> getFriendsRecentlyReadBooks(@RequestParam String usernames) {
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
            List<LightBookDTO> books = setResult(BookDocuments);

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
