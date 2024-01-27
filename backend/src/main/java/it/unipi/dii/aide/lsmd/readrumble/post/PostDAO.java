package it.unipi.dii.aide.lsmd.readrumble.post;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import it.unipi.dii.aide.lsmd.readrumble.library.LibraryBookDAO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDTO;
import it.unipi.dii.aide.lsmd.readrumble.utils.Status;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import javax.print.Doc;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Locale;
import java.time.*;

import redis.clients.jedis.Jedis;

public class PostDAO {



      public ResponseEntity<String> addPostsRedis(Post post) {

                 Jedis jedis = RedisConfig.getSession();

                 String input = post.getDate_added().toString();
                 DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("EEE MMM d HH:mm:ss zzz yyyy", Locale.ENGLISH);
                 ZonedDateTime zonedDateTime = ZonedDateTime.parse(input, inputFormatter);

                 DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                 String time = zonedDateTime.format(outputFormatter);

                String username = post.getUsername();
                  String bookId = "" + (post.getBook_id());
                  String ranking = "" + post.getRating();
                  String bookmark = "" + post.getBookmark();
                  String pagesRead = "" + post.getPages_read();
                  String key = "post:" + time + ":" + username + ":" + bookId + ":" + ranking + ":" + bookmark + ":" + pagesRead;
                  System.out.println("ho aggiunto il post con chiave: " + key);
                  Gson gson = new Gson();
                  jedis.hset(key, "description", post.getReview_text());
                  jedis.hset(key, "tags", gson.toJson(post.getTags()));
                  jedis.hset(key, "book_title", post.getBook_title());


                  jedis.close();

          return ResponseEntity.ok("Post added: " + key);

      }

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

                Document new_doc = new Document("book_id", post.getBook_id())
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
            } finally {
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
            PostDTO post = new PostDTO(
                    (doc.get("_id")).toString(),
                    doc.getLong("book_id"),
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
    public Post postDetails(ObjectId id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");
        Document query = new Document("_id", id);
        Document doc = collection.find(query).first();
        List<String> tags = (List<String>)doc.get("tags");
        return new Post(
                ((ObjectId) doc.get("_id")).toString(),
                     doc.getLong("book_id"),
                     doc.getInteger("rating"),
                     doc.getString("review_text"),
                     doc.getDate("date_added"),
                     doc.getString("book_title"),
                     doc.getString("username"),
                     tags,
                     doc.getInteger("bookmark"),
                     doc.getInteger("pages_read")
                     );

    }

    public List<PostDTO> allPost() {
        List<PostDTO> reviews = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        // Ottieni le prime 10 recensioni
        for (Document doc : collection.find().sort(new Document("date_added", -1)).limit(10)) {
            List<String> arrayTags = (List<String>) doc.get("tags");

            PostDTO review = new PostDTO(
                    ((ObjectId) doc.get("_id")).toString(),
                    doc.getLong("book_id"),
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

    public ResponseEntity<String> removePostRedis(String key) {
        System.out.println("provo ad eliminare " + key);
        Jedis jedis = RedisConfig.getSession();
        String response = null;


        long res = jedis.del(key);
        if(res == 1)
            response = "Post delete: " + key;
        else if(res == 0)
            response = "post not delete: " + key;
        jedis.close();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<String> removePostMongo( ObjectId id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");
        Document query = new Document("_id", id);
        Document target = collection.find(query).first();
        String response = null;
        if(target != null) {
            collection.deleteOne(target);
            response =  "post successful remove";
        } else
            response =  "failed to remove the post";
        return ResponseEntity.ok(response);
    }

    public List<PostDTO> getRecentFriendsPosts(List<String> friends) {
        List<PostDTO> postsTarget = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        List<Document> posts = collection.aggregate(List.of(
                new Document("$match", new Document("username", new Document("$in", friends))),
                new Document("$sort", new Document("date_added", -1)),
                new Document("$group", new Document("_id", "$username").append("mostRecentPost", new Document("$first", "$$ROOT"))),
                new Document("$project", new Document("id", "$mostRecentPost._id")
                        .append("book_id", "$mostRecentPost.book_id")
                        .append("rating", "$mostRecentPost.rating")
                        .append("date_added", "$mostRecentPost.date_added")
                        .append("book_title", "$mostRecentPost.book_title")
                        .append("username", "$mostRecentPost.username"))
        )).into(new ArrayList<>());

        for (Document doc : posts) {
            PostDTO post = new PostDTO(
                    ((ObjectId) doc.get("id")).toString(),
                    doc.getLong("book_id"),
                    doc.getInteger("rating"),
                    doc.getDate("date_added"),
                    doc.getString("book_title"),
                    doc.getString("username")
            );
            postsTarget.add(post);
        }

        return postsTarget;
    }


}
