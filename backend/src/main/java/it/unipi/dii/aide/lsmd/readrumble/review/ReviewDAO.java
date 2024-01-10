package it.unipi.dii.aide.lsmd.readrumble.review;

import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class ReviewDAO {


    public String addReview(ReviewDTO review) {
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



    public List<ReviewDTO> allReviewUser(String username) {
        List<ReviewDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("review");

        // Ottieni le prime 10 recensioni
        Document query = new Document("username", username);
        for (Document doc : collection.find(query).limit(10)) {
            ReviewDTO review = new ReviewDTO(
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
