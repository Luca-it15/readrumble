package it.unipi.dii.aide.lsmd.readrumble;


import com.mongodb.client.*;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.library.ActiveBookController;
import it.unipi.dii.aide.lsmd.readrumble.post.PostController;
import it.unipi.dii.aide.lsmd.readrumble.user.UserController;
import it.unipi.dii.aide.lsmd.readrumble.book.BookController;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MongoFullController {

    private final UserController userController;
    private final CompetitionController competitionController;
    private final AdminCompetitionController adminCompetitionController;
    private final PostController postController;
    private final ActiveBookController libraryController;
    private final BookController bookController;

    @Autowired
    public MongoFullController(UserController userController,
                               CompetitionController competitionController,
                               PostController postController,
                               ActiveBookController libraryController,
                               AdminCompetitionController adminCompetitionController,
                               BookController bookController) {
        this.userController = userController;
        this.competitionController = competitionController;
        this.adminCompetitionController = adminCompetitionController;
        this.postController = postController;
        this.libraryController = libraryController;
        this.bookController = bookController;
    }

    /**
     * Questo metodo restituisce i primi 10 libri presenti nel database
     * (Per ora non è utile, ma potrebbe tornare utile in futuro)
     *
     * @return Lista con 10 documenti
     */
    @GetMapping("/10books")
    public List<Document> get10Books() {
        MongoCollection<Document> Book_subCollection = MongoConfig.getCollection("Books");
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
        MongoCollection<Document> collection = MongoConfig.getCollection("Books");
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



}


