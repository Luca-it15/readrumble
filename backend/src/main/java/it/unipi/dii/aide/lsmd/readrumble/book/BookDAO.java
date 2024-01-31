package it.unipi.dii.aide.lsmd.readrumble.book;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;

import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.checkBookExist;
import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.checkUserExist;

import com.mongodb.client.MongoCollection;

import org.bson.Document;

import org.neo4j.driver.Session;
import org.neo4j.driver.Result;
import org.neo4j.driver.Record;
import org.neo4j.driver.Values;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Transaction;

import java.time.LocalDate;
import java.util.*;

public class BookDAO {
    private static HashMap<String, List<LightBookDTO>> inMemoryFavoriteBooks = new HashMap<>();
    private static HashMap<String, List<LightBookDTO>> inMemoryFavoriteBooksToBeDeleted = new HashMap<>();

    /**
     * This method saves the favorite books in memory to the graph DB every hour
     */
    public void saveInMemoryFavoriteBooks() {
        try {
            Session session = Neo4jConfig.getSession();

            for (String username : inMemoryFavoriteBooks.keySet()) {
                List<LightBookDTO> books = inMemoryFavoriteBooks.get(username);

                for (LightBookDTO book : books) {
                    session.run("MATCH (u:User {name: $username}), (b:Book {id: $book}) MERGE (u)-[r:FAVORS]->(b)",
                            Values.parameters("username", username, "book", book.getId()));
                }
            }

            inMemoryFavoriteBooks.clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * This method saves the favorite books to be deleted in memory to the document DB every hour
     */
    public void saveInMemoryFavoriteBooksToBeDeleted() {
        try {
            Session session = Neo4jConfig.getSession();

            for (String username : inMemoryFavoriteBooksToBeDeleted.keySet()) {
                List<LightBookDTO> books = inMemoryFavoriteBooksToBeDeleted.get(username);

                for (LightBookDTO book : books) {
                    session.run("MATCH (u:User {name: $username})-[r:FAVORS]->(b:Book {id: $book}) DELETE r",
                            Values.parameters("username", username, "book", book.getId()));
                }
            }

            inMemoryFavoriteBooksToBeDeleted.clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * This method turns a list of books' documents into a list of books
     *
     * @param bookDocuments the list of books
     * @return list of books
     */
    private List<LightBookDTO> setResult(List<Document> bookDocuments) {
        List<LightBookDTO> books = new ArrayList<>();
        for (Document doc : bookDocuments) {
            books.add(new LightBookDTO(doc.getLong("id"), doc.getString("title")));
        }
        return books;
    }

    /**
     * This method returns the wishlist of a user
     *
     * @param username of the user
     * @return id and title of the book
     */
    public List<LightBookDTO> getWishlist(String username) {
        MongoCollection<Document> WishlistCollection = MongoConfig.getCollection("Wishlists");

        List<Document> BookDocuments = WishlistCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$books"),
                new Document("$project", new Document("_id", 0).append("id", "$books.book_id").append("title", "$books.book_title"))
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            return null;
        } else {
            return setResult(BookDocuments);
        }
    }

    /**
     * This method adds a book to the wishlist of a user
     *
     * @param username of the user
     * @param bookId   of the book
     * @return response
     */
    public ResponseEntity<String> addToWishlist(String username, Long bookId, WishlistBookDTO book) {
        Jedis jedis = RedisConfig.getSession();

        // See if the book is already in the wishlist
        if (jedis.exists("wishlist:" + username + ":" + bookId)) {
            return ResponseEntity.badRequest().body("Book already in wishlist");
        }

        Map<String, String> bookMap = new HashMap<>();
        bookMap.put("book_id", String.valueOf(book.getBook_id()));
        bookMap.put("book_title", book.getBook_title());
        bookMap.put("num_pages", String.valueOf(book.getNum_pages()));
        bookMap.put("tags", String.join(",", book.getTags()));

        Transaction transaction = jedis.multi();
        transaction.hset("wishlist:" + username + ":" + bookId, bookMap);
        transaction.exec();

        return ResponseEntity.ok("Book added to wishlist");
    }

    /**
     * This method removes a book from the wishlist of a user
     *
     * @param username of the user
     * @return response
     */
    public ResponseEntity<String> removeFromWishlist(String username, Long bookId) {
        Jedis jedis = RedisConfig.getSession();

        if (!jedis.hexists("wishlist:" + username + ":" + bookId, "book_title")) {
            return ResponseEntity.badRequest().body("Book not in wishlist");
        }

        Transaction transaction = jedis.multi();
        transaction.del("wishlist:" + username + ":" + bookId);
        transaction.exec();

        return ResponseEntity.ok("Book removed from wishlist");
    }

    /**
     * This method returns the trending books of this month
     *
     * @return id and title of the book
     */
    public List<LightBookDTO> getTrending() {
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

        List<LightBookDTO> trendingBooks = new ArrayList<>();
        for (Document doc : result) {
            trendingBooks.add(new LightBookDTO(doc.getLong("_id"), doc.getString("book_title")));
        }

        return trendingBooks;
    }

    /**
     * This method returns the books recently read by the friends of a user
     *
     * @param usernames of the friends
     * @return id and title of the book
     */
    public List<LightBookDTO> getFriendsRecentlyReadBooks(String usernames) {
        if (usernames.isEmpty()) {
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
                new Document("$limit", 20)
        )).into(new ArrayList<>());

        if (BookDocuments.isEmpty()) {
            return null;
        } else {
            return setResult(BookDocuments);
        }
    }

    /**
     * This method returns the pages read by a user grouped by tag
     *
     * @param username of the user
     * @return list of tag and pages
     */
    public List<Document> getPagesReadByTag(String username) {
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
            return null;
        } else {
            return BookDocuments;
        }
    }

    /**
     * This method returns the favorite books of a user
     *
     * @param username the username of the user
     * @return the list of favorite books
     */
    public List<LightBookDTO> getFavoriteBooks(@PathVariable String username) {
        if (checkUserExist(username)) {
            try (Session session = Neo4jConfig.getSession()) {
                Result result = session.run("MATCH (u:User {name: $username})-[:FAVORS]->(b:Book) RETURN b.id AS id, b.title AS title",
                        Values.parameters("username", username));

                List<LightBookDTO> books = new ArrayList<>();
                while (result.hasNext()) {
                    Record record = result.next();
                    LightBookDTO book = new LightBookDTO(Long.parseLong(record.get("id").asString()), record.get("title").asString());
                    books.add(book);
                }

                return books;
            } catch (Exception e) {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * This method adds a book to the favorite books of a user
     *
     * @param username the username of the user
     * @param book     the id of the book
     * @return a ResponseEntity with the result of the operation
     */
    public ResponseEntity<String> addFavoriteBook(@PathVariable String username, @PathVariable String book) {
        if (checkUserExist(username) && checkBookExist(book)) {
            inMemoryFavoriteBooks.computeIfAbsent(username, k -> new ArrayList<>());
            inMemoryFavoriteBooks.get(username).add(new LightBookDTO(Long.parseLong(book), ""));
            return ResponseEntity.ok("Book added to favorites");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User or book does not exist.");
        }
    }

    /**
     * This method removes a book from the favorite books of a user
     *
     * @param username the username of the user
     * @param book     the id of the book
     * @return a ResponseEntity with the result of the operation
     */
    public ResponseEntity<String> removeFavoriteBook(@PathVariable String username, @PathVariable String book) {
        if (checkUserExist(username) && checkBookExist(book)) {
            inMemoryFavoriteBooksToBeDeleted.computeIfAbsent(username, k -> new ArrayList<>());
            inMemoryFavoriteBooksToBeDeleted.get(username).add(new LightBookDTO(Long.parseLong(book), ""));
            return ResponseEntity.ok("Book removed from favorites");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User or book does not exist.");
        }
    }

    /**
     * This method returns the suggested books for a user, based on the books that his friends like.
     * If the majority of the friends like a book, and the user does not like it, then the book is suggested.
     *
     * @param username the username of the user
     * @return the list of suggested books
     */
    public List<LightBookDTO> getSuggestedBooks(@PathVariable String username) {
        if (!checkUserExist(username)) {
            return null;
        }

        try (Session session = Neo4jConfig.getSession()) {
            Result result = session.run(
                    "MATCH (u:User {name: $username})-[:FOLLOWS]->(:User)-[:FAVORS]->(b:Book) " +
                            "WITH u,b, count(*) AS friends_favoring_book " +
                            "WHERE friends_favoring_book > 0.1 * COUNT{(u)-[:FOLLOWS]->(:User)} " +
                            "AND NOT EXISTS((u)-[:FAVORS]->(b)) " +
                            "RETURN b. id AS id, b.title AS title",
                    Values.parameters("username", username)
            );

            List<LightBookDTO> books = new ArrayList<>();
            while (result.hasNext()) {
                Record record = result.next();
                long id = Long.parseLong(record.get("id").asString());
                String title = record.get("title").asString();
                LightBookDTO book = new LightBookDTO(id, title);
                books.add(book);
            }

            return books;
        }
    }

    /**
     * This analytics method returns the monthly number of pages read by the user in the last six month
     *
     * @param username the username of the user
     * @return dates and pages read
     */
    public List<Document> getPagesTrend(@PathVariable String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("ActiveBooks");

        // Initialize a map with all the months of the last six months to zero
        Map<String, Integer> monthYearToPages = new LinkedHashMap<>();
        LocalDate date = LocalDate.now().minusMonths(6);
        for (int i = 0; i <= 6; i++) {
            monthYearToPages.put(date.getMonthValue() + "/" + date.getYear(), 0);
            date = date.plusMonths(1);
        }

        List<Document> results = collection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)),
                new Document("$limit", 6),
                new Document("$unwind", "$books"),
                new Document("$group", new Document("_id", new Document("month", "$month").append("year", "$year"))
                        .append("pages_read_sum", new Document("$sum", "$books.pages_read"))),
                new Document("$project", new Document("_id", 0)
                        .append("month", "$_id.month")
                        .append("year", "$_id.year")
                        .append("pages", "$pages_read_sum"))
        )).into(new ArrayList<>());

        // Update the map with the number of pages read for each month
        for (Document doc : results) {
            String key = doc.getInteger("month") + "/" + doc.getInteger("year");
            if (monthYearToPages.containsKey(key)) {
                monthYearToPages.put(key, doc.getInteger("pages"));
            }
        }

        // Convert the map to a list of documents
        List<Document> response = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : monthYearToPages.entrySet()) {
            String[] dateParts = entry.getKey().split("/");
            response.add(new Document("month", Integer.parseInt(dateParts[0]))
                    .append("year", Integer.parseInt(dateParts[1]))
                    .append("pages", entry.getValue()));
        }

        return response;
    }
}