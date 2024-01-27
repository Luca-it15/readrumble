package it.unipi.dii.aide.lsmd.readrumble.user;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import org.bson.Document;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Values;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;
import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.checkUserExist;
import static it.unipi.dii.aide.lsmd.readrumble.Neo4jFullController.getMaps;

public class UserDAO {
    private List<Document> inMemoryUsers = new ArrayList<>();
    private List<Document> inMemoryFollowRelations = new ArrayList<>();
    private List<Document> inMemoryFollowRelationsToBeDeleted = new ArrayList<>();

    public void saveInMemoryUsers() {
        for (Document user : inMemoryUsers) {
            String username = (String) user.get("_id");
            MongoCollection<Document> collection = MongoConfig.getCollection("Users");
            collection.insertOne(user);

            // Add a node to the graph
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MERGE (u:User {name: $username})",
                        Values.parameters("username", username));
            } catch (Exception e) {
                System.out.println("Add user operation failed: " + e.getMessage());
            }
        }
        inMemoryUsers.clear();
    }

    public void saveInMemoryFollowRelations() {
        for (Document followRelation : inMemoryFollowRelations) {
            String follower = (String) followRelation.get("follower");
            String followee = (String) followRelation.get("followee");

            // Add a relation to the graph
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MERGE (a:User {name: $follower}) " +
                                "MERGE (b:User {name: $followee}) " +
                                "MERGE (a)-[r:FOLLOWS]->(b)",
                        Values.parameters("follower", follower, "followee", followee));
            } catch (Exception e) {
                System.out.println("Add follow relation operation failed: " + e.getMessage());
            }
        }
        inMemoryFollowRelations.clear();
    }

    public void saveInMemoryFollowRelationsToBeDeleted() {
        for (Document followRelation : inMemoryFollowRelationsToBeDeleted) {
            String follower = (String) followRelation.get("follower");
            String followee = (String) followRelation.get("followee");

            // Delete the follow relation from the graph
            try (Session session = Neo4jConfig.getSession()) {
                session.run("MATCH (a:User {name: $follower})-[r:FOLLOWS]->(b:User {name: $followee}) " +
                                "DELETE r",
                        Values.parameters("follower", follower, "followee", followee));
            } catch (Exception e) {
                System.out.println("Delete follow relation operation failed: " + e.getMessage());
            }
        }
        inMemoryFollowRelationsToBeDeleted.clear();
    }

    public List<UserDTO> allUser() {
        List<UserDTO> users = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("User");

        // Ottieni le prime 10 recensioni
        for (Document doc : collection.find().limit(10)) {

            UserDTO user = new UserDTO(
                    doc.getString("_id"),
                    doc.getString("name"),
                    doc.getString("surname")
            );
            users.add(user);
        }

        return users;
    }

    public Document LogUser(User user) {
        String _id = user.getId();
        String password = user.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("Users")
                .find(eq("_id", _id)).iterator()) {

            if (cursor.hasNext()) {
                Document registered_user = cursor.next();

                if (password.equals(registered_user.get("password"))) {
                    return registered_user;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<String> RegUser(Document user) {
        String username = (String) user.get("_id");

        MongoCollection<Document> collection = MongoConfig.getCollection("Users");

        List<Document> usersCollection = collection.find(eq("_id", username)).into(new ArrayList<>());

        if (usersCollection.isEmpty()) {
            inMemoryUsers.add(user);
            return ResponseEntity.ok("Registration succeeded! You will now be redirected to the home page!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }
    }


    public Document PersonalInfo(User user) {
        String username = user.getId();
        String password = user.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("Users").find(eq("_id", username)).iterator()) {

            if (cursor.hasNext()) {
                Document userDoc = cursor.next();

                if (password.equals(userDoc.get("Password"))) {
                    return userDoc;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<String> ChangeData(Document changes) {
        String old_field = (String) changes.get("old_field");
        String new_field = (String) changes.get("new_field");
        String type_of_change_request = (String) changes.get("type_of_change_request");
        String username_to_use = (String) changes.get("username_to_use");

        MongoCollection<Document> collection = MongoConfig.getCollection("Users");

        try (MongoCursor<Document> cursor = collection.find(eq("_id", username_to_use)).cursor()) {
            if (cursor.hasNext()) {
                collection.updateOne(eq("_id", username_to_use), set(type_of_change_request, new_field));
                String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.ok("NOT FOUND");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("EXCEPTION IN SERVER");
        }
    }

    /**
     * This method returns id, name and surname of the user with the given username.
     *
     * @param username the username of the user to search
     * @return the id, name and surname of the user
     */
    public Map<String, String> getUser(@PathVariable String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");

        Document user = collection.find(eq("_id", username)).first();

        if (user != null) {
            return Map.of(
                    "_id", user.getString("_id"),
                    "name", user.getString("name"),
                    "surname", user.getString("surname")
            );
        } else {
            return null;
        }
    }

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

    public ResponseEntity<String> follow(@PathVariable String follower, @PathVariable String followee) {
        if (checkUserExist(follower) && checkUserExist(followee)) {
            inMemoryFollowRelations.add(new Document("follower", follower).append("followee", followee));
            return ResponseEntity.ok("Follow operation successful.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Follower or followee does not exist.");
        }
    }

    public ResponseEntity<String> unfollow(@PathVariable String follower, @PathVariable String followee) {
        if (checkUserExist(follower) && checkUserExist(followee)) {
            inMemoryFollowRelationsToBeDeleted.add(new Document("follower", follower).append("followee", followee));
            return ResponseEntity.ok("Unfollow operation successful.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Follower or followee does not exist.");
        }
    }

    public List<Map<String, Object>> getSuggestedFriends(@PathVariable String username) {
        if (checkUserExist(username)) {
            try (Session session = Neo4jConfig.getSession()) {
                Result result = session.run(
                        "MATCH (u1:User {name: $username})-[:FOLLOWS]->(u2:User)-[:FOLLOWS]->(f:User) " +
                                "WITH u1, u2, count(DISTINCT f) AS num_friends " +
                                "WHERE num_friends > 0.51 * COUNT{(u1)-[:FOLLOWS]->(:User)} " +
                                "AND NOT EXISTS((u1)-[:FOLLOWS]->(u2)) " +
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
