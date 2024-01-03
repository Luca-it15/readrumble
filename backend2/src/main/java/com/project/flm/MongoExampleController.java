package com.project.flm;
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

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api")


public class MongoExampleController{
    ConnectionString uri = new ConnectionString("mongodb://localhost:27017");
    MongoClient myClient = MongoClients.create(uri);
    MongoDatabase database = myClient.getDatabase("TestMongo");
    MongoCollection<Document> collection = database.getCollection("Utenti");

    @PostMapping("/login")
    public ResponseEntity<String> goLogin(@RequestBody Utente utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();
        List<Document> utenti = collection.find(eq("Username",username)).into(new ArrayList<>());
        System.out.println(utenti);
        Document utente_registrato = utenti.get(0);

        System.out.println(utente_registrato);
        System.out.println(utente_registrato.get("Username"));

        if(password.equals(utente_registrato.get("Password")))
        {
            return ResponseEntity.ok("Login Succeded ! You will now be redirected to your home ! ");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or password incorrect !");
        }

    }
    @PostMapping("/registration")
    public ResponseEntity<String> inserisciDati(@RequestBody Utente utente) {
        System.out.println(utente);
        String usernameDaControllare = utente.getUsername();
        List<Document> utenti = collection.find(eq("Username",usernameDaControllare)).into(new ArrayList<>());
        if(utenti.isEmpty())
        {
            Document new_doc = new Document();
            new_doc.replace("Name",utente.getName());
            new_doc.replace("Surname",utente.getSurname());
            new_doc.replace("Username",utente.getUsername());
            new_doc.replace("Password",utente.getPassword());
            collection.insertOne(new_doc);
            return ResponseEntity.ok("Registration Succeded ! You will now be redirected to the Login page ! ");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }

    }

}


