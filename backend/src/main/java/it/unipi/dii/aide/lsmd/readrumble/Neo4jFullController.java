package it.unipi.dii.aide.lsmd.readrumble;

import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.utils.UserNotExistsException;
import org.neo4j.driver.*;
import org.neo4j.driver.Record;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// !!! UNTESTED !!!
// A parte favoriteBooks, che funziona

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Neo4jFullController {
    /**
     * This method checks if a user and a book exist in the graph
     *
     * @param username the username of the user
     * @throws RuntimeException if the user does not exist
     */
    private void checkUserExist(String username) {
        try (Session session = Neo4jConfig.getSession()) {
            // Control if the username exists
            Result userExists = session.run("MATCH (u:User {name: $username}) RETURN u",
                    Values.parameters("username", username));
            if (!userExists.hasNext()) {
                throw new RuntimeException("Username " + username + " not found in graph.");
            }
        }
    }

    /**
     * @francesco per lanciare le eccezioni bisogna far si che la funzione sia throws
     * sennò non escono dalla funzione, dopo di che quando si chiama la funzione bisogna metterla
     * in un blocco try - catch
     * é buona norma definirsi un'eccezione personalizzata in questi tipi di casi
     * @param username
     * @throws UserNotExistsException
     */
    private void checkUserExistException(String username) throws UserNotExistsException {
        try (Session session = Neo4jConfig.getSession()) {
            // Control if the username exists
            Result userExists = session.run("MATCH (u:User {name: $username}) RETURN u",
                    Values.parameters("username", username));
            if (!userExists.hasNext()) {
                throw new UserNotExistsException(username);
            }
        }
    }

    /**
     * This method checks if a book exist in the graph
     *
     * @param book the id of the book
     * @throws RuntimeException if the book does not exist
     */
    private void checkBookExist(String book) {
        try (Session session = Neo4jConfig.getSession()) {
            Result bookExists = session.run("MATCH (b:Book {id: $book}) RETURN b",
                    Values.parameters("book", book));
            if (!bookExists.hasNext()) {
                throw new RuntimeException("Book " + book + " not found in graph.");
            }
        }
    }

    private List<Map<String, Object>> getMaps(Result result) {
        List<Map<String, Object>> resultBooks = new ArrayList<>();
        while (result.hasNext()) {
            Record record = result.next();

            Map<String, Object> book = new HashMap<>();
            book.put("id", record.get("id").toString());
            book.put("title", record.get("title").toString());
            resultBooks.add(book);
        }
        return resultBooks;
    }

    /**
     * This method adds a user to the graph
     *
     * @param username the username of the user
     * @return a ResponseEntity with the result of the operation
     */
    @PostMapping("/newUser/{username}")
    public ResponseEntity<String> addUser(@PathVariable String username) {
        try (Session session = Neo4jConfig.getSession()) {
            session.run("MERGE (u:User {name: $username})",
                    Values.parameters("username", username));
            return ResponseEntity.ok("Add user operation successful.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Add user operation failed: " + e.getMessage());
        }
    }

    /**
     * This method returns the friends of a user
     *
     * @param username the username of the user
     * @return the list of friends
     */
    @GetMapping("/following/{username}")
    public List<String> getFollowing(@PathVariable String username) {
        try (Session session = Neo4jConfig.getSession()) {
            Result result = session.run("MATCH (u:User {name: $username})-[:FOLLOWS]->(f:User) RETURN f.name AS following",
                    Values.parameters("username", username));
            List<String> following = new ArrayList<>();
            while (result.hasNext()) {
                following.add(result.next().get("following").asString());
            }
            return following;
        }
    }

    /**
     * This method creates the relation :FOLLOWS from follower to followee
     *
     * @param follower the username of the follower
     * @param followee the username of the "soon to be" followed
     * @return a ResponseEntity with the result of the operation
     */
    @PostMapping("/follow/{follower}/{followee}")
    public ResponseEntity<String> follow(@PathVariable String follower, @PathVariable String followee) {
        checkUserExist(follower);
        checkUserExist(followee);

        try (Session session = Neo4jConfig.getSession()) {
            session.run("MERGE (a:User {name: $follower}) " +
                            "MERGE (b:User {name: $followee}) " +
                            "MERGE (a)-[r:FOLLOWS]->(b)",
                    Values.parameters("follower", follower, "followee", followee));
            return ResponseEntity.ok("Follow operation successful.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Follow operation failed: " + e.getMessage());
        }
    }

    /**
     * This method deletes the relation :FOLLOWS from follower to followee
     *
     * @param follower the username of the follower
     * @param followee the username of the "soon to be" unfollowed
     * @return a ResponseEntity with the result of the operation
     */
    @DeleteMapping("/unfollow/{follower}/{followee}")
    public ResponseEntity<String> unfollow(@PathVariable String follower, @PathVariable String followee) {
        try {
            checkUserExist(follower);
            checkUserExist(followee);

            try (Session session = Neo4jConfig.getSession()) {
                session.run("MATCH (a:User {name: $follower})-[r:FOLLOWS]->(b:User {name: $followee}) " +
                                "DELETE r",
                        Values.parameters("follower", follower, "followee", followee));
                return ResponseEntity.ok("Unfollow operation successful.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unfollow operation failed: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unfollow operation failed: " + e.getMessage());
        }
    }

    /**
     * This method returns the favorite books of a user
     *
     * @param username the username of the user
     * @return the list of favorite books
     */
    @GetMapping("/favoriteBooks/{username}")
    public List<Map<String, Object>> getFavoriteBooks(@PathVariable String username) {
        try {
            checkUserExist(username);

            try (Session session = Neo4jConfig.getSession()) {
                // If the username exists, proceed with the query
                Result result = session.run("MATCH (u:User {name: $username})-[:FAVORS]->(b:Book) RETURN b.id AS id, b.title AS title",
                        Values.parameters("username", username));
                return getMaps(result);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
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
    @PostMapping("/addFavoriteBook/{username}/{book}")
    public ResponseEntity<String> addFavoriteBook(@PathVariable String username, @PathVariable String book) {
        try {
            checkUserExist(username);
            checkBookExist(book);

            // Proceed with the adding of the book
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MATCH (u:User {name: $username}), (b:Book {id: $book}) MERGE (u)-[r:FAVORS]->(b)",
                        Values.parameters("username", username, "book", book));
            }
            return ResponseEntity.ok("Add favorite book operation successful.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Add favorite book operation failed: " + e.getMessage());
        }
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
        try {
            checkUserExist(username);
            checkBookExist(book);

            System.out.println("User " + username + " removing book: " + book + " from favorites");

            // Proceed with the removing of the book
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MATCH (u:User {name: $username})-[r:FAVORS]->(b:Book {id: $book}) DELETE r",
                        Values.parameters("username", username, "book", book));
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Neo4j: Remove favorite book operation failed: " + e.getMessage());
            }
            System.out.println("User " + username + " removed book: " + book + " from favorites");
            return ResponseEntity.ok("Remove favorite book operation successful.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Remove favorite book operation failed: " + e.getMessage());
        }
    }

    /**
     * This method returns the suggested books for a user, based on the books that his friends like.
     * If the majority of the friends like a book, and the user does not like it, then the book is suggested.
     *
     * @param username the username of the user
     * @return the list of suggested books
     */
    @GetMapping("/suggestedBooks/{username}")
    public List<Map<String, Object>> getSuggestedBooks(@PathVariable String username) {
       try {
           checkUserExistException(username);
       } catch (UserNotExistsException e) {
           System.err.println(e.getMessage());
       }
        try (Session session = Neo4jConfig.getSession()) {
            Result result = session.run(
                    "MATCH (u:User {name: $username})-[:FOLLOWS]->(:User)-[:FAVORS]->(b:Book) " +
                            "WITH u,b, count(*) AS friends_favoring_book " +
                            "WHERE friends_favoring_book > 0.51 * COUNT{(u)-[:FOLLOWS]->(:User)} " +
                            "AND NOT EXISTS((u)-[:FAVORS]->(b)) " +
                            "RETURN b. id AS id, b.title AS title",
                    Values.parameters("username", username)
            );

            System.out.println("Suggested books for user " + username + ":");

            return getMaps(result);
        }
    }

    @GetMapping("/suggestedFriend/{username}")
    public List<Map<String, Object>> getSuggestedFriend(@PathVariable String username) {
        try {
            checkUserExistException(username);
        } catch (UserNotExistsException e) {
            System.err.println(e.getMessage());
        }
        try (Session session = Neo4jConfig.getSession()) {
            Result result = session.run(
                    "MATCH (u1:User {name: 'nome_utente'})-[:FOLLOWS]->(u2:User)-[:FOLLOWS]->(f:User)" +
            "WITH u1, u2, count(DISTINCT f) AS num_friends" +
            "WHERE num_friends > 0.8 * size((u1)-[:FOLLOWS]->(:User))" +
            "AND NOT EXISTS((u1)-[:FOLLOWS]->(u2))" +
            "RETURN u2.name AS suggested_user",

            Values.parameters("username", username)
            );
            return getMaps(result);
        }
    }
}
