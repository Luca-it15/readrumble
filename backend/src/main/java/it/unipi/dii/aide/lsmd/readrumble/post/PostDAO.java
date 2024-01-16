package it.unipi.dii.aide.lsmd.readrumble.post;

import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.library.LibraryBookDAO;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PostDAO {
    public String addPost(Post post) {
        String response = null;
        try {
            // Creazione di un oggetto Review a partire dai dati ricevuti dal frontend
            MongoCollection<Document> collection1 = MongoConfig.getCollection("Posts");
            MongoCollection<Document> collection2 = MongoConfig.getCollection("Active_books");
            //current year and month
            LocalDate current_date = LocalDate.now();
            int year = current_date.getYear();
            int month = current_date.getMonthValue();
            Document query = new Document("username", post.getUsername())
                    .append("year", year).append("month", month);
            Document userDocument = collection1.find(query).first();
            Document lb = null;
            if (userDocument != null) {
                List<Document> books = (List<Document>) userDocument.get("books");
                for (Document book : books) {
                    if (post.getBook_id() == book.getInteger("book_id")) {
                        lb = book;
                        break;
                    } else {
                        System.out.println("the book in the user library doesn't exist");
                    }
                }
                List<String> arrayTags = (List<String>) lb.get("tags"); //book's tags
                int new_bookmark = post.getBookmark();
                int pages_read = (new_bookmark - lb.getInteger("bookmark"));

                Document new_doc = new Document("_id", post.get_id())
                        .append("book_id", post.getBook_id())
                        .append("rating", post.getRating())
                        .append("review_text", post.getReview_text())
                        .append("date_added", post.getDate_added())
                        .append("book_title", post.getBook_title())
                        .append("username", post.getUsername())
                        .append("tags", arrayTags)
                        .append("bookmark", new_bookmark)
                        .append("pages_read", pages_read);
                //insert the post
                collection1.insertOne(new_doc);
                int new_pages_read = lb.getInteger("pages_read") + pages_read;
                //update che active book with the new bookmark
                //if the book is finish we need to update the status of the book
                //0: not finish yet, 1: finish
                Bson updateDocument = null;
                if (new_bookmark == lb.getInteger("num_pages")) {
                    updateDocument = new Document("bookmark", new_bookmark).append("pages_read", new_pages_read).append("status", 1);

                } else {
                    updateDocument = new Document("bookmark", new_bookmark).append("pages_read", new_pages_read);
                    response = "Recensione salvata con successo!";
                 }
                 collection2.updateOne(lb, updateDocument);
                } else{
                    System.out.println("book not found in the user's library");
                    response = "Errore durante il salvataggio della recensione.";
                }

            } catch(MongoException e){
                e.printStackTrace();
                response = "Errore durante il salvataggio della recensione.";
            } finally{
                MongoConfig.closeConnection();
                return response;
            }
    }

    public List<PostDTO> allPostsUser(String username) {
        List<PostDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        Document query = new Document("_id", username);
        for (Document doc : collection.find(query).sort(new Document("date", -1)).limit(10)) {
            List<String> arrayTags = (List<String>) doc.get("tags");

            PostDTO review = new PostDTO(
                  doc.getInteger("_id"),
                  doc.getInteger("rating"),
                  doc.getDate("date_added"),
                  doc.getString("book_title"),
                  doc.getString("username")
            );
            reviews.add(review);
        }

        // Chiudi il client MongoDB
        return reviews;
    }

    public List<PostDTO> allPost() {
        List<PostDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        for (Document doc : collection.find().sort(new Document("date", -1)).limit(10)) {
            List<String> arrayTags = (List<String>) doc.get("tags");

            PostDTO review = new PostDTO(
                    doc.getInteger("_id"),
                    doc.getInteger("rating"),
                    doc.getDate("date_added"),
                    doc.getString("book_title"),
                    doc.getString("username")
            );
            reviews.add(review);
        }

        // Chiudi il client MongoDB
        return reviews;
    }
}
