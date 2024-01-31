package it.unipi.dii.aide.lsmd.readrumble.post;

import com.google.gson.Gson;
import com.mongodb.client.MongoCollection;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.utils.Status;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;

import static com.mongodb.client.model.Filters.eq;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Locale;
import java.time.*;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;

public class PostDAO {



      public ResponseEntity<String> addPostsRedis(Document post) {

                 JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

                 String input = post.getString("date_added");
                 DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.ENGLISH);
                 ZonedDateTime zonedDateTime = ZonedDateTime.parse(input, inputFormatter);


                 DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                 String time = zonedDateTime.format(outputFormatter);

                String username = post.getString("username");
                  String bookId = "" + (post.getLong("book_id"));
                  String ranking = "" + post.getInteger("rating");
                  String bookmark = "" + post.getInteger("bookmark");
                  int pagesRead = post.getInteger("pages_read");
                  System.out.println(pagesRead);
                  String key = "post:" + time + ":" + username + ":" + bookId + ":" + ranking + ":" + bookmark + ":" + pagesRead;
                  Gson gson = new Gson();
                  jedis.hset(key, "review_text", post.getString("review_text"));
                  jedis.hset(key, "tags", gson.toJson((List<String>)post.get("tag")));
                  jedis.hset(key, "book_title", post.getString("book_title"));

                  List<String> competitions_names = (List<String>) post.get("competitions_name");
                  List<String> competitions_tag = (List<String>) post.get("competitions_tag");
                  //String key = "competition:"+competitionTitle + ":" + competitionTag + ":" + username;
                  int i = 0;
                  int j = 0;
               for(;!competitions_names.isEmpty() && i < competitions_names.size() && j < competitions_tag.size(); i++, j++ ) {
                      String compkey = "competition:"+competitions_names.get(i) + ":" + competitions_tag.get(j) + ":" + username;
                      System.out.println("la competizione che vogliamo aggiornare a chiave: " + compkey);
                      String value = jedis.get(compkey);
                      System.out.println("before update " + value);
                      int new_pages_read = Integer.parseInt(value) + pagesRead;
                      System.out.println("after update " + new_pages_read);
                      jedis.set(compkey, String.valueOf(new_pages_read));
                      i++;
                  }

          return ResponseEntity.ok("Post added: " + key);

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
                  doc.getString("username"),
                    doc.getString("text"));
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
                    doc.getString("username"),
                    doc.getString("text"));
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
                new Document("$limit", 20),
                new Document("$project", new Document("id", "$_id")
                        .append("book_id", "$book_id")
                        .append("rating", "$rating")
                        .append("date_added", "$date_added")
                        .append("book_title", "$book_title")
                        .append("username", "$username")
                        .append("text", "$review_text"))
        )).into(new ArrayList<>());

        for (Document doc : posts) {
            PostDTO post = new PostDTO(
                    ((ObjectId) doc.get("id")).toString(),
                    doc.getLong("book_id"),
                    doc.getInteger("rating"),
                    doc.getDate("date_added"),
                    doc.getString("book_title"),
                    doc.getString("username"),
                    doc.getString("text")
            );
            postsTarget.add(post);
        }

        return postsTarget;
    }


}
