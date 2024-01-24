package it.unipi.dii.aide.lsmd.readrumble.user;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class UserDAO {
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

        System.out.println(_id + " " + password);

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("Users")
                .find(eq("_id", _id)).iterator()) {

            if (cursor.hasNext()) {
                Document utente_registrato = cursor.next();

                System.out.println(utente_registrato);
                System.out.println(utente_registrato.get("_id"));

                if (password.equals(utente_registrato.get("password"))) {
                    return utente_registrato;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            System.out.println("Exception error catched: " + e.getMessage());
            return null;
        }
    }

    public ResponseEntity<String> RegUser(Document user) {
        System.out.println(user);
        String usernameDaControllare = (String) user.get("_id");
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        List<Document> utenti = collection.find(eq("_id", usernameDaControllare)).into(new ArrayList<>());
        if (utenti.isEmpty()) {
            collection.insertOne(user);
            return ResponseEntity.ok("Registration Succeded ! You will now be redirected to the Login page ! ");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }
    }

    public Document PersonalInfo(User user) {
        String username = user.getId();
        String password = user.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("Users").find(eq("_id", username)).iterator()) {

            if (cursor.hasNext()) {
                Document utente_registrato = cursor.next();

                System.out.println(utente_registrato);
                System.out.println(utente_registrato.get("Username"));

                if (password.equals(utente_registrato.get("Password"))) {
                    return utente_registrato;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            System.out.println("Exception error catched: " + e.getMessage());
            return null;
        }
    }

    public ResponseEntity<String> ChangeData(Document changes) {
        String old_field = (String) changes.get("old_field");
        String new_field = (String) changes.get("new_field");
        String type_of_change_request = (String) changes.get("type_of_change_request");
        String username_to_use = (String) changes.get("username_to_use");
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        try (MongoCursor cursor = collection.find(eq("_id", username_to_use)).cursor()) {
            if (cursor.hasNext()) {
                collection.updateOne(eq("_id", username_to_use), set(type_of_change_request, new_field));
                String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.ok("NOT FOUND");
            }
        } catch (Exception e) {
            System.out.println("Exception error catched: " + e.getMessage());
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

        System.out.println(user);

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
}
