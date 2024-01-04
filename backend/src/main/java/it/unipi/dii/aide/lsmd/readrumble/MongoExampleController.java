package it.unipi.dii.aide.lsmd.readrumble;


import com.mongodb.client.*;
import com.mongodb.ConnectionString;
import org.bson.Document;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gt;

import it.unipi.dii.aide.lsmd.readrumble.bean.Utente;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api")

//Create connection string
public class MongoExampleController{


    @PostMapping("/login")
    public ResponseEntity<String> goLogin(@RequestBody Utente utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();

        try (MongoCursor<Document> cursor = MongoConfig.getCollection("user")
                .find(eq("Username", username)).iterator()) {

            if (cursor.hasNext()) {
                Document utente_registrato = cursor.next();

                System.out.println(utente_registrato);
                System.out.println(utente_registrato.get("Username"));

                if (password.equals(utente_registrato.get("Password"))) {
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
    @PostMapping("/registration")
    public ResponseEntity<String> inserisciDati(@RequestBody Utente utente) {
        System.out.println(utente);
        String usernameDaControllare = utente.getUsername();
        MongoCollection<Document> collection = MongoConfig.getCollection("user");
        List<Document> utenti = collection.find(eq("Username",usernameDaControllare)).into(new ArrayList<>());
        if(utenti.isEmpty())
        {
            Document new_doc = new Document("Name",utente.getName())
                    .append("Surname",utente.getSurname())
                    .append("Username", utente.getUsername())
                    .append("Password",utente.getPassword());
            collection.insertOne(new_doc);
            MongoConfig.closeConnection();
            return ResponseEntity.ok("Registration Succeded ! You will now be redirected to the Login page ! ");
        }
        else
        {
            MongoConfig.closeConnection();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }

    }

}


