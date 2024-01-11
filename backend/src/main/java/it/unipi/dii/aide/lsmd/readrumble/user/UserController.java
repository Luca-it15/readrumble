package it.unipi.dii.aide.lsmd.readrumble.user;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @PostMapping("/user/quest")
    @ResponseBody
    public ResponseEntity<String> quest() {
        return ResponseEntity.ok("I'm Picking Up Good Vibrations");
    }
    @PostMapping("/login")
    public ResponseEntity<String> goLogin(@RequestBody UserDTO utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("user")
                .find(eq("Username", username)).iterator()) {

            if (cursor.hasNext()) {
                Document utente_registrato = cursor.next();

                System.out.println(utente_registrato);
                System.out.println(utente_registrato.get("Username"));

                if (password.equals(utente_registrato.get("Password"))) {
                    //add the user into the AuthenticationUser list
                    AuthenticationUserDTO newUser = new AuthenticationUserDTO(
                            utente_registrato.get("Name").toString(),
                            utente_registrato.get("Surname").toString(),
                            utente_registrato.get("Username").toString()
                    );

                    AuthenticationUserDAO.addAuthenticationUser(newUser);

                    return ResponseEntity.ok("Login succeeded! You will now be redirected to your home!");
                } else {
                    return ResponseEntity.badRequest().body("Username or password incorrect!");
                }
            } else {
                return ResponseEntity.badRequest().body("Username does not exist!");
            }
        } catch (Exception e) {
            // Gestisci eventuali eccezioni qui
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
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
        MongoCollection<Document> collection = MongoConfig.getCollection("user");
        if(collection.find(eq("Username", username_to_use)).cursor().hasNext())
        {
            if(type_of_change_request.equals("Username"))
            {
                if(collection.find(eq("Username",new_field)).cursor().hasNext())
                {
                    return ResponseEntity.ok("Username already in use");
                }
                else
                {
                    collection.updateOne(eq("Username",username_to_use),set(type_of_change_request,new_field));
                    String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
                    return ResponseEntity.ok(result);
                }
            }
            else
            {
                collection.updateOne(eq("Username",username_to_use),set(type_of_change_request,new_field));
                String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
                return ResponseEntity.ok(result);
            }

        }
        else
        {
            return ResponseEntity.ok("NOT FOUND");
        }

    }

    @PostMapping("/personalinfo")
    public Document retrieveInfo(@RequestBody UserDTO utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("user")
                .find(eq("Username", username)).iterator()) {

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
        MongoCollection<Document> collection = MongoConfig.getCollection("user");
        List<Document> utenti = collection.find(eq("Username", usernameDaControllare)).into(new ArrayList<>());
        if (utenti.isEmpty()) {
            Document new_doc = new Document("Name", utente.getName())
                    .append("Surname", utente.getSurname())
                    .append("Username", utente.getUsername())
                    .append("Password", utente.getPassword());
            collection.insertOne(new_doc);
            MongoConfig.closeConnection();
            return ResponseEntity.ok("Registration Succeded ! You will now be redirected to the Login page ! ");
        } else {
            MongoConfig.closeConnection();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }
    }
}
