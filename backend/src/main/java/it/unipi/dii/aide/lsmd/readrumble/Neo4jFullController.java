package it.unipi.dii.aide.lsmd.readrumble;

import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import org.neo4j.driver.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Neo4jFullController {

    /**
     * This method returns the friends of a user
     *
     * @param username the username of the user
     * @return the list of friends
     */
    @GetMapping("/following")
    public List<String> getFollowing(@RequestParam String username) {
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
     * This method returns the favorite books of a user
     *
     * @param username the username of the user
     * @return the list of favorite books
     */
    @GetMapping("/favoriteBooks")
    public List<String> getFavoriteBooks(@RequestParam String username) {
        try (Session session = Neo4jConfig.getSession()) {
            // Controlla se l'username esiste
            Result userExists = session.run("MATCH (u:User {name: $username}) RETURN u",
                    Values.parameters("username", username));
            if (!userExists.hasNext()) {
                throw new RuntimeException("Username " + username + " non esiste nel grafo.");
            }

            // Se l'username esiste, procedi con la query originale
            Result result = session.run("MATCH (u:User {name: $username})-[:FAVORS]->(b:Book) RETURN b.title AS favorite_books",
                    Values.parameters("username", username));
            List<String> favoriteBooks = new ArrayList<>();
            while (result.hasNext()) {
                // aggiungi virgolette per evitare problemi con i titoli dei libri
                favoriteBooks.add("\"" + result.next().get("favorite_books").asString() + "\"");
            }
            return favoriteBooks;
        }
    }

    /**
     * This method returns the suggested books for a user, based on the books that his friends like.
     * If the majority of the friends like a book, and the user does not like it, then the book is suggested.
     *
     * @param username the username of the user
     * @return the list of suggested books
     */
    @GetMapping("/suggestedBooks")
    public List<String> getSuggestedBooks(@RequestParam String username) {
        try (Session session = Neo4jConfig.getSession()) {
            Result result = session.run(
                    "MATCH (u:User {name: $username})-[:FOLLOWS]->(:User)-[:FAVORS]->(b:Book) " +
                            "WITH b, count(*) AS friends_favoring_book " +
                            "WHERE friends_favoring_book > 0.51 * size((u)-[:FOLLOWS]->(:User)) " +
                            "AND NOT EXISTS((u)-[:FAVORS]->(b)) " +
                            "RETURN b.title AS suggested_books",
                    Values.parameters("username", username)
            );
            List<String> suggestedBooks = new ArrayList<>();
            while (result.hasNext()) {
                suggestedBooks.add(result.next().get("suggested_books").asString());
            }
            return suggestedBooks;
        }
    }
}
