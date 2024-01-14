package it.unipi.dii.aide.lsmd.readrumble.review;

import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ReviewDAO {

    public String addReview(ReviewDTO review) {
        try {
            // Creazione di un oggetto Review a partire dai dati ricevuti dal frontend
            MongoCollection<Document> collection = MongoConfig.getCollection("Posts");
            System.out.println("recensione dal titolo: " + review.getTitle());
            System.out.println(review.getTags());

            Document new_doc = new Document("title", review.getTitle())
                    .append("_id", review.getUsername())
                    .append("numberOfPagesRead", review.getNumberOfPagesRead())
                    .append("review", review.getReview())
                    .append("rating", review.getRating())
                    .append("date", review.getDate())
                            .append("tags", review.getTags()
                    );

            collection.insertOne(new_doc);
            // Restituisci una risposta al frontend
            return "Recensione salvata con successo!";
        } catch (MongoException e) {
            e.printStackTrace();
            return "Errore durante il salvataggio della recensione.";
        }

    }

    public List<ReviewDTO> allReviewUser(String username) {
        List<ReviewDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        Document query = new Document("_id", username);
        for (Document doc : collection.find(query).sort(new Document("date", -1)).limit(10)) {
            List<String> arrayTags = (List<String>) doc.get("tags");

            ReviewDTO review = new ReviewDTO(
                    doc.getString("title"),
                    doc.getString("username"),
                    doc.getInteger("numberOfPagesRead"),
                    doc.getString("review"),
                    doc.getInteger("rating"),
                    doc.getDate("date"),
                    arrayTags
            );
            reviews.add(review);
        }

        // Chiudi il client MongoDB
        return reviews;
    }

    public List<ReviewDTO> allReview() {
        List<ReviewDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        for (Document doc : collection.find().sort(new Document("date", -1)).limit(10)) {
            List<String> arrayTags = (List<String>) doc.get("tags");

            ReviewDTO review = new ReviewDTO(
                    doc.getString("book_title"),
                    doc.getString("username"),
                    doc.getInteger("pages_read"),
                    doc.getString("review_text"),
                    doc.getInteger("rating"),
                    doc.getDate("date"),
                    arrayTags
            );
            reviews.add(review);
        }

        // Chiudi il client MongoDB
        return reviews;
    }
}
