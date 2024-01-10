package it.unipi.dii.aide.lsmd.readrumble;


import com.mongodb.MongoException;
import com.mongodb.client.*;
import it.unipi.dii.aide.lsmd.readrumble.bean.Book;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.set;

import it.unipi.dii.aide.lsmd.readrumble.bean.Utente;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.bean.Review;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api")

//Create connection string
public class MongoExampleController {

    private BookRepositoryImpl bookRepository;
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

    @PostMapping("/change")
    public ResponseEntity<String> goChange(@RequestBody Document changes) {
        String old_field = (String) changes.get("old_field");
        String new_field = (String) changes.get("new_field");
        String type_of_change_request = (String) changes.get("type_of_change_request");
        String username_to_use = (String) changes.get("username_to_use");
        MongoCollection<Document> collection = MongoConfig.getCollection("user");
        if(collection.find(eq("Username", username_to_use)).cursor().hasNext())
        {
            collection.updateOne(eq("Username",username_to_use),set(type_of_change_request,new_field));
            String result = (String) type_of_change_request + " Changed from " + old_field + " To " + new_field;
            return ResponseEntity.ok(result);
        }
        else
        {
            return ResponseEntity.ok("NOT FOUND");
        }

    }

    @PostMapping("/personalinfo")
    public Document retrieveInfo(@RequestBody Utente utente) {
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
    public ResponseEntity<String> inserisciDati(@RequestBody Utente utente) {
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

    /**
     * Questo metodo restituisce i primi 10 libri presenti nel database
     * (Per ora non è utile, ma potrebbe tornare utile in futuro)
     *
     * @return Lista con 10 documenti
     */
    @GetMapping("/10books")
    public List<Document> get10Books() {
        MongoCollection<Document> Book_subCollection = MongoConfig.getCollection("Book_sub");
        List<Document> Book_subDocuments = Book_subCollection.find().limit(10).into(new ArrayList<>()); // Limita a 10 documenti

        if (Book_subDocuments.isEmpty()) { // La collezione è vuota
            System.out.println("No books found");
            return null;
        }

        // Crea una lista e riempila con i documenti trovati
        List<Document> books = new ArrayList<>();
        for (Document doc : Book_subDocuments) {
            books.add(doc);
        }

        System.out.println("Found " + books.size() + " books");

        return books;
    }

    @GetMapping("/bookautocomplete")
    public List<Book> autocomplete(@RequestParam String query) {
        bookRepository = new BookRepositoryImpl();
        List<Book> matchingBooks = bookRepository.findByTitleContainingIgnoreCase(query);


        return matchingBooks;
    }

    @GetMapping("/books2")
    public List<Document> getBooks2() {
        //ritorna dieci libri a caso
        MongoCollection<Document> collection = MongoConfig.getCollection("Book_sub");
        List<Document> books = collection.find().into(new ArrayList<>());
        List<Document> selectedDocuments = new ArrayList<>();
        Random random = new Random();
        int numberOfDocumentsToSelect = 10;
        if (books.isEmpty()) {
            Document libro_nullo = new Document();
            libro_nullo.append("Title", "Ops, You don't have any book");
            return null;
        } else {

            if (books.size() >= numberOfDocumentsToSelect) {
                // Loop per selezionare documenti casuali
                for (int i = 0; i < numberOfDocumentsToSelect; i++) {
                    // Genera un indice casuale
                    int randomIndex = random.nextInt(books.size());

                    // Aggiungi il documento corrispondente all'indice casuale alla lista selezionata
                    selectedDocuments.add(books.get(randomIndex));

                    // Rimuovi il documento dalla lista originale per evitare la selezione duplicata
                    books.remove(randomIndex);
                }

            }
            return selectedDocuments;
        }
    }

    /**
     * <h3>Review functionality</h3>
     *
     * Funcion for insert a review into the reviews collection
     * @param review
     * review is a Review riferiment
     * @return String
     * return the response
     */
    @PostMapping("/review")
    public String submitReview(@RequestBody Review review) {
        try {
            // Creazione di un oggetto Review a partire dai dati ricevuti dal frontend
            MongoCollection<Document> collection = MongoConfig.getCollection("review");
            System.out.println("recensione dal titolo: " + review.getTitle());
            Document new_doc = new Document("title", review.getTitle())
                    .append("username", review.getUsername())
                    .append("numberOfPagesRead", review.getNumberOfPagesRead())
                    .append("review", review.getReview())
                    .append("rating", review.getRating())
                            .append("date", review.getDate());

            collection.insertOne(new_doc);
            MongoConfig.closeConnection();
            // Restituisci una risposta al frontend
            return "Recensione salvata con successo!";
        } catch (MongoException e) {
            e.printStackTrace();
            return "Errore durante il salvataggio della recensione.";
        }

    }

    /**
     * Function for retrieve the first 10 review and send them at the frontend
     * @return List<Review> include the first 10 review
     */
    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
          List<Review> reviews = new ArrayList<>();

           MongoCollection<Document> collection = MongoConfig.getCollection("review");

         // Ottieni le prime 10 recensioni
           for (Document doc : collection.find().limit(10)) {
               Review review = new Review(
                       doc.getString("title"),
                       doc.getString("username"),
                       doc.getInteger("numberOfPagesRead"),
                       doc.getString("review"),
                       doc.getDouble("rating"),
                       doc.getDate("date")
               );
               reviews.add(review);
            }

            // Chiudi il client MongoDB
           MongoConfig.closeConnection();

           return reviews;
    }




}


