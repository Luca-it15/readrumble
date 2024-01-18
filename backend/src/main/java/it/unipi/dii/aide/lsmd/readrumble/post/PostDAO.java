package it.unipi.dii.aide.lsmd.readrumble.post;

import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.library.LibraryBookDAO;
import it.unipi.dii.aide.lsmd.readrumble.utils.Status;
import org.bson.Document;
import org.bson.conversions.Bson;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PostDAO {
    public String addPost(Post post) {
        String response = null;
        try {
            // Creazione di un oggetto Review a partire dai dati ricevuti dal frontend
            MongoCollection<Document> collection1 = MongoConfig.getCollection("Posts");
            MongoCollection<Document> collection2 = MongoConfig.getCollection("ActiveBooks");
            //current year and month
            LocalDate current_date = LocalDate.now();
            int year = current_date.getYear();
            int month = current_date.getMonthValue();
            Document query = new Document("username", post.getUsername())
                    .append("year", year).append("month", month);
            Document userDocument = collection2.find(query).first();
            Document lb = null;
            if (userDocument != null) {
                List<Document> books = (List<Document>) userDocument.get("books");
                int index = 0;
                for (Document book : books) {
                    if (post.getBook_id() == book.getInteger("book_id")) {
                        lb = book;
                        break;
                    }
                    index++;
                }
                List<String> arrayTags = (List<String>) lb.get("tags"); //book's tags
                int new_bookmark = post.getBookmark();
                int pages_read = (new_bookmark - lb.getInteger("bookmark"));
                Instant instant = Instant.now();
                long timestamp = instant.toEpochMilli();

                Document new_doc = new Document("_id", timestamp)
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

                 lb.put("bookmark", new_bookmark);
                 lb.put("pages_read", new_pages_read);
                 //update che active book with the new bookmark
                    //if the book is finish we need to update the status of the book
                    //0: not finish yet, 1: finish
                 if (new_bookmark == lb.getInteger("num_pages"))
                   lb.put("state", Status.FINISHED);

                   collection2.updateOne(query, new Document("$set", new Document("books." + index, lb)));
                   response = "Recensione salvata con successo!";
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

    public List<PostDTO> allPostsUser(String parametro, boolean user) {
        List<PostDTO> posts = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        Document query = null;
        if(user)
         query = new Document("username", parametro);
        else {
            int book_id = Integer.parseInt(parametro);
            query = new Document("book_id", book_id);
        }
        for (Document doc : collection.find(query).sort(new Document("date_added", -1)).limit(10)) {
            long[] _id = new long[1];
            try {
                _id[0] = doc.getLong("_id");
            } catch ( ClassCastException e ) {
                System.out.println("the post id is a integer, we need to convert in long value");
                _id[0] = doc.getInteger("_id").longValue();
            }
            PostDTO post = new PostDTO(
                  _id[0],
                    doc.getInteger("book_id"),
                  doc.getInteger("rating"),
                  doc.getDate("date_added"),
                  doc.getString("book_title"),
                  doc.getString("username")
            );
            posts.add(post);
        }

        // Chiudi il client MongoDB
        return posts;
    }
    public Post postDetails(long id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");
        Document query = new Document("_id", id);
        Document doc = collection.find(query).first();
        long[] _id = new long[1];
        try {
            _id[0] = doc.getLong("_id");
        } catch ( ClassCastException e ) {
            System.out.println("the post id is a integer, we need to convert in long value");
            _id[0] = doc.getInteger("_id").longValue();
        }
        return new Post(
                      _id[0],
                     doc.getInteger("book_id"),
                     doc.getInteger("rating"),
                     doc.getString("review_text"),
                     doc.getDate("date_added"),
                     doc.getString("book_title"),
                     doc.getString("username"),
                     doc.getInteger("bookmark")
                     );

    }

    public List<PostDTO> allPost() {
        List<PostDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        for (Document doc : collection.find().sort(new Document("date", -1)).limit(10)) {
            List<String> arrayTags = (List<String>) doc.get("tags");

            PostDTO review = new PostDTO(
                    doc.getInteger("_id"),
                    doc.getInteger("book_id"),
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
