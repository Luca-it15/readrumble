package it.unipi.dii.aide.lsmd.readrumble;


import com.mongodb.MongoException;
import com.mongodb.client.*;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionController;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.bean.Review;
import it.unipi.dii.aide.lsmd.readrumble.user.UserController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MongoFullController {

    private final UserController userController;
    private final CompetitionController competitionController;
    @Autowired
    public MongoFullController(UserController userController, CompetitionController competitionController) {
        this.userController = userController;
        this.competitionController = competitionController;
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
                    .append("rating", review.getRating());
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
                       doc.getDouble("rating")
               );
               reviews.add(review);
            }

            // Chiudi il client MongoDB
           MongoConfig.closeConnection();

           return reviews;
    }




}


