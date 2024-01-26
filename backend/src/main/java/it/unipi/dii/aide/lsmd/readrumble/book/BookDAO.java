package it.unipi.dii.aide.lsmd.readrumble.book;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;

import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Values;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import redis.clients.jedis.Jedis;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.neo4j.driver.Record;

import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.checkBookExist;
import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.checkUserExist;

public class BookDAO {
    private final ReadWriteLock lock = new ReentrantReadWriteLock();

    private List<LightBookDTO> setResult(List<Document> bookDocuments) {
        List<LightBookDTO> books = new ArrayList<>();
        for (Document doc : bookDocuments) {
            books.add(new LightBookDTO(doc.getLong("id"), doc.getString("title")));
        }
        return books;
    }

    public List<LightBookDTO> getWishlist(String username) {
        lock.readLock().lock();
        try {
            Jedis jedis = RedisConfig.getSession();

            // Get all the keys of the wishlist of the user
            Set<String> keys = jedis.keys("wishlist:" + username + ":*");

            List<LightBookDTO> books = new ArrayList<>();

            // For each key, get the id and title of the book
            for (String key : keys) {
                Map<String, String> book = jedis.hgetAll(key);

                Long bookId = Long.parseLong(key.split(":")[2]);

                books.add(new LightBookDTO(bookId, book.get("book_title")));
            }

            System.out.println(books);

            return books;
        } finally {
            lock.readLock().unlock();
        }
    }


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

        jedis.hset("wishlist:" + username + ":" + bookId, bookMap);

        return ResponseEntity.ok("Book added to wishlist");
    }

    public ResponseEntity<String> removeFromWishlist(String username, Long bookId) {
        Jedis jedis = RedisConfig.getSession();

        // See if the book is not in the wishlist
        if (!jedis.hexists("wishlist:" + username + ":" + bookId, "book_title")) {
            return ResponseEntity.badRequest().body("Book not in wishlist");
        }

        jedis.del("wishlist:" + username + ":" + bookId);
        return ResponseEntity.ok("Book removed from wishlist");
    }

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

        System.out.println(result);

        List<LightBookDTO> trendingBooks = new ArrayList<>();
        for (Document doc : result) {
            trendingBooks.add(new LightBookDTO(doc.getLong("_id"), doc.getString("book_title")));
        }

        return trendingBooks;
    }

    public List<LightBookDTO> getFriendsRecentlyReadBooks(String usernames) {
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
                new Document("$limit", 20)
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

    public List<Document> getPagesReadByTag(String username) {
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

    public List<LightBookDTO> getFavoriteBooks(@PathVariable String username) {
        System.out.println("Richiesta libri preferiti per: " + username);

        if (checkUserExist(username)) {
            try (Session session = Neo4jConfig.getSession()) {
                // If the username exists, proceed with the query
                Result result = session.run("MATCH (u:User {name: $username})-[:FAVORS]->(b:Book) RETURN b.id AS id, b.title AS title",
                        Values.parameters("username", username));

                List<LightBookDTO> books = new ArrayList<>();
                while (result.hasNext()) {
                    Record record = result.next();
                    System.out.println(record);
                    LightBookDTO book = new LightBookDTO(Long.parseLong(record.get("id").asString()), record.get("title").asString());
                    books.add(book);
                }

                System.out.println("Favorite books for user " + username + ":");
                System.out.println(books);

                return books;
            } catch (Exception e) {
                return null;
            }
        } else {
            return null;
        }
    }

    public ResponseEntity<String> addFavoriteBook(@PathVariable String username, @PathVariable String book) {
        System.out.println("Richiesta aggiunta libro: " + book + " ai preferiti di: " + username);

        if (checkUserExist(username) && checkBookExist(book)) {
            try {
                // Proceed with the adding of the book
                Session session = Neo4jConfig.getSession();
                session.run("MATCH (u:User {name: $username}), (b:Book {id: $book}) MERGE (u)-[r:FAVORS]->(b)",
                        Values.parameters("username", username, "book", book));

                System.out.println("User " + username + " added book: " + book + " to favorites");

                return ResponseEntity.ok("Add favorite book operation successful.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Add favorite book operation failed: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User or book does not exist.");
        }
    }

    public ResponseEntity<String> removeFavoriteBook(@PathVariable String username, @PathVariable String book) {
        System.out.println("Richiesta rimozione libro: " + book + " dai preferiti di: " + username);

        if (checkUserExist(username) && checkBookExist(book)) {
            try {
                System.out.println("User " + username + " removing book: " + book + " from favorites");

                // Proceed with the removing of the book
                Session session = Neo4jConfig.getSession();
                session.run("MATCH (u:User {name: $username})-[r:FAVORS]->(b:Book {id: $book}) DELETE r",
                        Values.parameters("username", username, "book", book));
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Neo4j: Remove favorite book operation failed: " + e.getMessage());
            }

            System.out.println("User " + username + " removed book: " + book + " from favorites");

            return ResponseEntity.ok("Remove favorite book operation successful.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User or book does not exist.");
        }
    }

    public List<LightBookDTO> getSuggestedBooks(@PathVariable String username) {
        System.out.println("Richiesta libri suggeriti per: " + username);

        if (!checkUserExist(username)) {
            System.out.println("User " + username + " does not exist");
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

            System.out.println("Suggested books for user " + username + ":");

            List<LightBookDTO> books = new ArrayList<>();
            while (result.hasNext()) {
                System.out.println(result.next());
                Record record = result.next();
                Long id = Long.parseLong(record.get("id").asString());
                String title = record.get("title").asString();
                LightBookDTO book = new LightBookDTO(id, title);
                books.add(book);
            }

            return books;
        }
    }
}