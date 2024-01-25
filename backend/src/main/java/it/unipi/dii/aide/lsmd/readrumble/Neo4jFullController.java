package it.unipi.dii.aide.lsmd.readrumble;

import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import org.neo4j.driver.*;
import org.neo4j.driver.Record;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Neo4jFullController {
    /**
     * This method checks if a user exists in the graph
     *
     * @param username the username of the user
     * @throws RuntimeException if the user does not exist
     */
    public static boolean checkUserExist(String username) {
        try (Session session = Neo4jConfig.getSession()) {
            // Control if the username exists
            Result userExists = session.run("MATCH (u:User {name: $username}) RETURN u",
                    Values.parameters("username", username));
            return userExists.hasNext();
        }
    }

    /**
     * This method checks if a book exist in the graph
     *
     * @param book the id of the book
     * @throws RuntimeException if the book does not exist
     */
    public static boolean checkBookExist(String book) {
        try (Session session = Neo4jConfig.getSession()) {
            Result bookExists = session.run("MATCH (b:Book {id: $book}) RETURN b",
                    Values.parameters("book", book));
            return bookExists.hasNext();
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
        if (checkUserExist(follower) && checkUserExist(followee)) {
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MERGE (a:User {name: $follower}) " +
                                "MERGE (b:User {name: $followee}) " +
                                "MERGE (a)-[r:FOLLOWS]->(b)",
                        Values.parameters("follower", follower, "followee", followee));
                return ResponseEntity.ok("Follow operation successful.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Follow operation failed: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Follower or followee does not exist.");
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
        if (checkUserExist(follower) && checkUserExist(followee)) {
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MATCH (a:User {name: $follower})-[r:FOLLOWS]->(b:User {name: $followee}) " +
                                "DELETE r",
                        Values.parameters("follower", follower, "followee", followee));
                return ResponseEntity.ok("Unfollow operation successful.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unfollow operation failed: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Follower or followee does not exist.");
        }
    }

    @GetMapping("/suggestedFriends/{username}")
    public List<Map<String, Object>> getSuggestedFriend(@PathVariable String username) {
        if (checkUserExist(username)) {
            System.out.println("Retrieving suggestend friends for " + username);

            try (Session session = Neo4jConfig.getSession()) {
                Result result = session.run(
                        "MATCH (u1:User {name: $username})-[:FOLLOWS]->(u2:User)-[:FOLLOWS]->(f:User) "+
                "WITH u1, u2, count(DISTINCT f) AS num_friends "+
                "WHERE num_friends > 0.51 * COUNT{(u1)-[:FOLLOWS]->(:User)} "+
                "AND NOT EXISTS((u1)-[:FOLLOWS]->(u2)) "+
                "RETURN u2.name AS suggested_user ",
                Values.parameters("username", username)
                );
                return getMaps(result);
            }
        } else {
            return null;
        }
    }
}
