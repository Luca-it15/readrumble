package it.unipi.dii.aide.lsmd.readrumble.user;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @PostMapping("/login")
    public Document goLogin(@RequestBody UserDTO utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();
        System.out.println(username + " " + password);
        System.out.println(utente);
        try (MongoCursor<Document> cursor = MongoConfig.getCollection("User")
                .find(eq("_id", username)).iterator()) {

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
            // Gestisci eventuali eccezioni qui
            return null;
        } finally {
            MongoConfig.closeConnection();
        }
    }

    @PostMapping("/change")
    public ResponseEntity<String> goChange(@RequestBody Document changes) {
        String old_field = (String) changes.get("old_field");
        String new_field = (String) changes.get("new_field");
        String type_of_change_request = (String) changes.get("type_of_change_request");
        String username_to_use = (String) changes.get("username_to_use");
        System.out.println("This is the type of change request " + type_of_change_request);
        System.out.println("we are in change and this is your username " + username_to_use);
        MongoCollection<Document> collection = MongoConfig.getCollection("User");
        try(MongoCursor cursor = collection.find(eq("_id", username_to_use)).cursor())
        {
            if(cursor.hasNext())
            {
                if(type_of_change_request.equals("_id"))
                {
                    if(collection.find(eq("_id",new_field)).cursor().hasNext())
                    {
                        return ResponseEntity.ok("Username already in use");
                    }
                    else
                    {
                        collection.updateOne(eq("_id",username_to_use),set(type_of_change_request,new_field));
                        collection.updateOne(eq("_id",username_to_use),set(type_of_change_request,new_field));
                        String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
                        return ResponseEntity.ok(result);
                    }
                }
                else
                {
                    collection.updateOne(eq("_id",username_to_use),set(type_of_change_request,new_field));
                    String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
                    return ResponseEntity.ok(result);
                }

            }
            else
            {
                return ResponseEntity.ok("NOT FOUND");
            }
        }
        catch(Exception e)
        {
            System.err.println("Captured Exception: " + e.getMessage());
            return ResponseEntity.ok("EXCEPTION IN SERVER");
        }


    }

    @PostMapping("/personalinfo")
    public Document retrieveInfo(@RequestBody UserDTO utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("User")
                .find(eq("_id", username)).iterator()) {

            if (cursor.hasNext()) {
                Document utente_registrato = cursor.next();

                System.out.println(utente_registrato);
                System.out.println(utente_registrato.get("_id"));

                if (password.equals(utente_registrato.get("Password"))) {
                    return utente_registrato;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            // Gestisci eventuali eccezioni qui
            return null;
        } finally {
            MongoConfig.closeConnection();
        }
    }

    @PostMapping("/registration")
    public ResponseEntity<String> inserisciDati(@RequestBody UserDTO utente) {
        System.out.println(utente);
        String usernameDaControllare = utente.getUsername();
        MongoCollection<Document> collection = MongoConfig.getCollection("User");
        List<Document> utenti = collection.find(eq("_id", usernameDaControllare)).into(new ArrayList<>());
        if (utenti.isEmpty()) {
            Document new_doc = new Document("name", utente.getName())
                    .append("surname", utente.getSurname())
                    .append("_id", utente.getUsername())
                    .append("password", utente.getPassword());
            collection.insertOne(new_doc);
            MongoConfig.closeConnection();
            return ResponseEntity.ok("Registration Succeded ! You will now be redirected to the Login page ! ");
        } else {
            MongoConfig.closeConnection();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }
    }
}
