package com.readrumble.massi.backend.part;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MongoExampleController
{
    // Iniezione di dipendenza del MongoTemplate (oggetto principale per interagire con MongoDB)
    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/dati")
    public List<Utente> getDati(@RequestParam String nome) {
        // Effettua una query per recuperare tutti i documenti con "nome" uguale al parametro fornito
        Query query = new Query(Criteria.where("nome").is(nome));
        List<Utente> utenti = mongoTemplate.find(query, Utente.class);

        return utenti;
    }
    @PostMapping("/login")
    public ResponseEntity<String> goLogin(@RequestBody Utente utente) {
        String username = utente.getUsername();
        String password = utente.getPassword();
        Query query = new Query(Criteria.where("username").is(username));
        List<Utente> utenti = mongoTemplate.find(query, Utente.class);
        Utente utente_registrato = utenti.get(0);
        System.out.println(password + " " + utente_registrato.getPassword());
        if(password.equals(utente_registrato.getPassword()))
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
        Query query = new Query(Criteria.where("username").is(usernameDaControllare));
        List<Utente> utenti = mongoTemplate.find(query, Utente.class);

        if (utenti.isEmpty()) {
            mongoTemplate.save(utente);
            return ResponseEntity.ok("Registration Succeded ! You will now be redirected to the Login page ! ");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use, please choose another one!");
        }
    }
}



