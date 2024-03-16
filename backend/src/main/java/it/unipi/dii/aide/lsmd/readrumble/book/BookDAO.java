package it.unipi.dii.aide.lsmd.readrumble.book;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;

import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.checkUserExist;

import static it.unipi.dii.aide.lsmd.readrumble.book.BookController.setResult;

import com.mongodb.client.MongoCollection;

import org.bson.Document;

import org.neo4j.driver.Session;
import org.neo4j.driver.Result;
import org.neo4j.driver.Record;
import org.neo4j.driver.Values;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import redis.clients.jedis.JedisCluster;

import java.time.Instant;
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
     * This method returns the wishlist of a user
     *
     * @param username of the user
     * @return id and title of the book
     */
    public List<LightBookDTO> getWishlist(String username) {
        MongoCollection<Document> UsersCollection = MongoConfig.getCollection("Users");

        List<Document> BookDocuments = UsersCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", "$wishlist"),
                new Document("$project", new Document("_id", 0).append("id", "$wishlist.book_id").append("title", "$wishlist.book_title"))
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
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        // See if the book is already in the wishlist
        if (jedis.exists("wishlist:" + username + ":" + bookId)) {
            return ResponseEntity.badRequest().body("Book already in wishlist");
        }

        Map<String, String> bookMap = new HashMap<>();
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
     * @return response
     */
    public ResponseEntity<String> removeFromWishlist(String username, Long bookId) {
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        if (!jedis.exists("wishlist:" + username + ":" + bookId)) {
            return ResponseEntity.badRequest().body("Book not in wishlist");
        }

        jedis.del("wishlist:" + username + ":" + bookId);

        return ResponseEntity.ok("Book removed from wishlist");
    }

    /**
     * This method returns the trending books of the last 30 days
     *
     * @return id and title of the book
     */
    public List<LightBookDTO> getTrending() {
        MongoCollection<Document> BooksCollection = MongoConfig.getCollection("Books");
        Date currentDate = Date.from(Instant.now());

        List<Document> result = BooksCollection.aggregate(List.of(
                new Document("$unwind", "$recent_posts"),
                new Document("$match", new Document("recent_posts.rating", new Document("$gt", 0L))),
                new Document("$group",
                        new Document("_id", new Document("id", "$_id")
                                .append("title", "$title"))
                                .append("average_rating", new Document("$avg", "$recent_posts.rating"))
                                .append("latest_post_date", new Document("$max", new Document("$toLong", new Document("$toDate", "$recent_posts.date_added"))))),
                new Document("$project",
                        new Document("_id", 0L)
                                .append("id", "$_id.id")
                                .append("title", "$_id.title")
                                .append("average_rating", "$average_rating")
                                .append("latest_post_date", new Document("$toDate", "$latest_post_date")))
        )).into(new ArrayList<>());

        for (Document doc : result) {
            double posts_staleness = (double) ((currentDate.getTime() / (1000 * 60 * 60) - doc.getDate("latest_post_date").getTime() / (1000 * 60 * 60) ));
            double score = doc.getDouble("average_rating") / (posts_staleness + 0.01);

            doc.append("score", score);
        }

        result.sort((o1, o2) -> Double.compare(o2.getDouble("score"), o1.getDouble("score")));

        result = result.subList(0, Math.min(10, result.size()));

        List<LightBookDTO> trendingBooks = new ArrayList<>();
        for (Document doc : result) {
            trendingBooks.add(new LightBookDTO(doc.getLong("id"), doc.getString("title")));
        }

        return trendingBooks;
    }

    /**
     * This method returns the books recently read by the friends of a user
     *
     * @param username of the user
     * @return id and title of the book
     */
    public List<LightBookDTO> getFriendsRecentlyReadBooks(@PathVariable String username) {
        MongoCollection<Document> UsersCollection = MongoConfig.getCollection("Users");

        // Get the document relative to the given user, and get all the documents in the "recent_friends_posts" field, getting the id and title of the books of the posts
        List<Document> BookDocuments = UsersCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$project", new Document("friends_posts", 1L)),
                new Document("$unwind", new Document("path", "$friends_posts")),
                new Document("$group", new Document("_id",
                        new Document("id", "$friends_posts.book_id"))
                            .append("id", new Document("$first", "$friends_posts.book_id"))
                            .append("title", new Document("$first", "$friends_posts.book_title")))
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
        MongoCollection<Document> UsersCollection = MongoConfig.getCollection("Users");

        List<Document> BookDocuments = UsersCollection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$project",
                        new Document("recent_active_books", 1L)),
                new Document("$unwind", "$recent_active_books"),
                new Document("$unwind", "$recent_active_books.books"),
                new Document("$unwind", "$recent_active_books.books.tags"),
                new Document("$group",
                        new Document("_id", new Document("tag", "$recent_active_books.books.tags"))
                                .append("pages_read", new Document("$sum", "$recent_active_books.books.pages_read"))
                                .append("tag", new Document("$first", "$recent_active_books.books.tags")))
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

                List<Long> ids = new ArrayList<>();

                while (result.hasNext()) {
                    Record record = result.next();

                    if (ids.contains(Long.parseLong(record.get("id").asString()))) {
                        continue;
                    }

                    LightBookDTO book = new LightBookDTO(Long.parseLong(record.get("id").asString()), record.get("title").asString());
                    books.add(book);
                    ids.add(book.getId());
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
        inMemoryFavoriteBooks.computeIfAbsent(username, k -> new ArrayList<>());
        inMemoryFavoriteBooks.get(username).add(new LightBookDTO(Long.parseLong(book), ""));
        return ResponseEntity.ok("Book added to favorites");
    }

    /**
     * This method removes a book from the favorite books of a user
     *
     * @param username the username of the user
     * @param book     the id of the book
     * @return a ResponseEntity with the result of the operation
     */
    public ResponseEntity<String> removeFavoriteBook(@PathVariable String username, @PathVariable String book) {
        inMemoryFavoriteBooksToBeDeleted.computeIfAbsent(username, k -> new ArrayList<>());
        inMemoryFavoriteBooksToBeDeleted.get(username).add(new LightBookDTO(Long.parseLong(book), ""));
        return ResponseEntity.ok("Book removed from favorites");
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
                            "WHERE friends_favoring_book > 0.5 * COUNT{(u)-[:FOLLOWS]->(:User)} " +
                            "AND NOT EXISTS((u)-[:FAVORS]->(b)) " +
                            "RETURN b. id AS id, b.title AS title",
                    Values.parameters("username", username)
            );

            List<LightBookDTO> books = new ArrayList<>();

            List<Long> ids = new ArrayList<>();

            while (result.hasNext()) {
                Record record = result.next();

                if (ids.contains(Long.parseLong(record.get("id").asString()))) {
                    continue;
                }

                long id = Long.parseLong(record.get("id").asString());
                String title = record.get("title").asString();
                LightBookDTO book = new LightBookDTO(id, title);
                books.add(book);
                ids.add(id);
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
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");

        return collection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$project", new Document("recent_active_books", 1L)),
                new Document("$unwind", "$recent_active_books"),
                new Document("$unwind", "$recent_active_books.books"),
                new Document("$group", new Document("_id", new Document("month", "$recent_active_books.month"))
                        .append("pages", new Document("$sum", "$recent_active_books.books.pages_read"))
                        .append("month", new Document("$first", "$recent_active_books.month"))
                        .append("year", new Document("$first", "$recent_active_books.year")))
        )).into(new ArrayList<>());
    }

    /**
     * This method adds a book to the list of active books of a user
     *
     * @param username of the user
     * @param book     the book to be added
     * @return a ResponseEntity with the result of the operation
     */
    public ResponseEntity<String> startReading(String username, Long bookId, ActiveBookDTO book) {
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        if (jedis.exists("started:" + username + ":" + bookId)) {
            return ResponseEntity.badRequest().body("Book already being read");
        }

        // If the book is in the wishlist, remove it
        if (jedis.exists("wishlist:" + username + ":" + bookId)) {
            jedis.del("wishlist:" + username + ":" + bookId);
        }

        Map<String, String> bookMap = new HashMap<>();
        bookMap.put("book_title", book.getTitle());
        bookMap.put("num_pages", String.valueOf(book.getNum_pages()));
        bookMap.put("tags", String.join(",", book.getTags()));

        jedis.hset("started:" + username + ":" + bookId, bookMap);

        return ResponseEntity.ok("Book started reading");
    }
}