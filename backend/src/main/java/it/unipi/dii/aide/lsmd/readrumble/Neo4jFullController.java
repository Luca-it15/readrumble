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

    /**
     * This method formats the result of a query into a list of maps
     *
     * @param result the result of the query
     * @return the list of maps
     */
    public static List<Map<String, Object>> getMaps(Result result) {
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
}
