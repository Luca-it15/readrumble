package it.unipi.dii.aide.lsmd.readrumble;


import com.mongodb.client.*;
import com.mongodb.client.model.Sorts;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminBookController;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.library.ActiveBookController;
import it.unipi.dii.aide.lsmd.readrumble.post.PostController;
import it.unipi.dii.aide.lsmd.readrumble.search.SearchController;
import it.unipi.dii.aide.lsmd.readrumble.user.UserController;
import it.unipi.dii.aide.lsmd.readrumble.book.BookController;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

import static com.mongodb.client.model.Filters.*;

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
    private final SearchController searchController;
    private final AdminBookController adminBookController;

    @Autowired
    public MongoFullController(UserController userController,
                               CompetitionController competitionController,
                               PostController postController,
                               ActiveBookController libraryController,
                               AdminCompetitionController adminCompetitionController,
                               BookController bookController,
                               SearchController searchController,
                               AdminBookController adminBookController) {
        this.userController = userController;
        this.competitionController = competitionController;
        this.adminCompetitionController = adminCompetitionController;
        this.postController = postController;
        this.libraryController = libraryController;
        this.bookController = bookController;
        this.searchController = searchController;
        this.adminBookController = adminBookController;
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

    /**
     * This analytics method returns the monthly number of pages read by the user in the last six month
     *
     * @param username the username of the user
     * @return dates and pages read
     */
    @GetMapping("/analytics/pagesTrend/{username}")
    public List<Document> getPagesTrend(@PathVariable String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("ActiveBooks");

        // Initialize a map with all the months of the last six months to zero
        Map<String, Integer> monthYearToPages = new LinkedHashMap<>();
        LocalDate date = LocalDate.now().minusMonths(6);
        for (int i = 0; i <= 6; i++) {
            monthYearToPages.put(date.getMonthValue() + "/" + date.getYear(), 0);
            date = date.plusMonths(1);
        }

        List<Document> results = collection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$sort", new Document("year", -1).append("month", -1)), // Sort stage
                new Document("$limit", 6), // Limit stage
                new Document("$unwind", "$books"),
                new Document("$group", new Document("_id", new Document("month", "$month").append("year", "$year"))
                        .append("pages_read_sum", new Document("$sum", "$books.pages_read"))),
                new Document("$project", new Document("_id", 0)
                        .append("month", "$_id.month")
                        .append("year", "$_id.year")
                        .append("pages", "$pages_read_sum"))
        )).into(new ArrayList<>());

        // Update the map with the number of pages read for each month
        for (Document doc : results) {
            String key = doc.getInteger("month") + "/" + doc.getInteger("year");
            if (monthYearToPages.containsKey(key)) {
                monthYearToPages.put(key, doc.getInteger("pages"));
            }
        }

        // Convert the map to a list of documents
        List<Document> response = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : monthYearToPages.entrySet()) {
            String[] dateParts = entry.getKey().split("/");
            response.add(new Document("month", Integer.parseInt(dateParts[0]))
                    .append("year", Integer.parseInt(dateParts[1]))
                    .append("pages", entry.getValue()));
        }

        return response;
    }
}


