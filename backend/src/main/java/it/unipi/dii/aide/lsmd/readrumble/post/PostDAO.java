package it.unipi.dii.aide.lsmd.readrumble.post;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;

import com.google.gson.Gson;

import org.bson.Document;
import org.bson.types.ObjectId;

import org.springframework.http.ResponseEntity;

import com.mongodb.client.MongoCollection;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.time.ZonedDateTime;

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

        String key = "post:" + time + ":" + username + ":" + bookId + ":" + ranking + ":" + bookmark + ":" + pagesRead;
        Gson gson = new Gson();

        jedis.hset(key, "review_text", post.getString("review_text"));
        jedis.hset(key, "tags", gson.toJson(post.get("tag")));
        jedis.hset(key, "book_title", post.getString("book_title"));

        List<String> competitions_names = (List<String>) post.get("competitions_name");
        List<String> competitions_tag = (List<String>) post.get("competitions_tag");

        int i = 0;
        int j = 0;
        for (; !competitions_names.isEmpty() && i < competitions_names.size() && j < competitions_tag.size(); i++, j++) {
            String competitionKey = "competition:" + competitions_names.get(i) + ":" + competitions_tag.get(j) + ":" + username;
            String value = jedis.get(competitionKey);
            int new_pages_read = Integer.parseInt(value) + pagesRead;

            jedis.set(competitionKey, String.valueOf(new_pages_read));
        }

        return ResponseEntity.ok("Post added: " + key);
    }

    public List<PostDTO> allPosts(String parameter, boolean user_or_book, boolean loadAll) {
        MongoCollection<Document> collection;
        Document query;

        if (user_or_book) {
            collection = MongoConfig.getCollection("Users");
            query = new Document("_id", parameter);
        } else {
            long book_id = Long.parseLong(parameter);

            collection = MongoConfig.getCollection("Books");
            query = new Document("_id", book_id);
        }

        List<Document> pipeline = new ArrayList<>();
        pipeline.add(new Document("$match", query));
        pipeline.add(new Document("$unwind", "$recent_posts"));
        pipeline.add(new Document("$addFields", new Document("recent_posts.date_added", new Document("$toDate", "$recent_posts.date_added"))));
        pipeline.add(new Document("$sort", new Document("recent_posts.date_added", -1)));

        if (loadAll)
            pipeline.add(new Document("$skip", 10));

        pipeline.add(new Document("$limit", 10));

        List<PostDTO> posts = new ArrayList<>();

        for (Document doc : collection.aggregate(pipeline)) {
            Document postDoc = (Document) doc.get("recent_posts");
            PostDTO post;

            // If looking for posts of a specific user, get the username from the user document
            if (user_or_book) {
                String username = doc.getString("_id");

                post = new PostDTO(
                        postDoc.getLong("book_id"),
                        postDoc.getInteger("rating"),
                        postDoc.getDate("date_added"),
                        postDoc.getString("book_title"),
                        username,
                        postDoc.getString("review_text"));
            } else {
                // If looking for posts of a specific book, get the book id and title from the book document
                long book_id = doc.getLong("_id");
                String book_title = doc.getString("title");

                post = new PostDTO(
                        book_id,
                        postDoc.getInteger("rating"),
                        postDoc.getDate("date_added"),
                        book_title,
                        postDoc.getString("username"),
                        postDoc.getString("review_text"));
            }

            posts.add(post);
        }

        return posts;
    }

    public Post postDetails(String dataTarget, String parameter, boolean user) {

        MongoCollection<Document> collection;
        Document query;
        long book_id = 0;

        if (user) {
            collection = MongoConfig.getCollection("Users");
            query = new Document("_id", parameter);
        } else {
            book_id = Long.parseLong(parameter);

            collection = MongoConfig.getCollection("Books");
            query = new Document("_id", book_id);
        }

        Document doc = collection.find(query).first();
        assert doc != null;

        List<Document> postDoc = (List<Document>) doc.get("recent_posts");
        System.out.println("post doc vale " + postDoc);
        Document postTarget = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX");
            formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date date = formatter.parse(dataTarget);

          for(Document post: postDoc) {
              Date datePost = post.getDate("date_added");
              if (datePost == date) {
                  postTarget = post;
                  break;
              }
            }
          } catch (Exception e) {
            e.printStackTrace();
          }


        List<String> tags = (List<String>) postTarget.get("tags");
        if(user) {
            String username = doc.getString("_id");
            return new Post(
                    postTarget.getLong("book_id"),
                    postTarget.getInteger("rating"),
                    postTarget.getString("review_text"),
                    postTarget.getString("date_added"),
                    postTarget.getString("book_title"),
                    username,
                    tags,
                    postTarget.getInteger("bookmark"),
                    postTarget.getInteger("pages_read")
            );
        } else {
            String book_title = doc.getString("title");
            return new Post(
                    book_id,
                    postTarget.getInteger("rating"),
                    postTarget.getString("review_text"),
                    postTarget.getString("date_added"),
                    book_title,
                    postTarget.getString("username"),
                    tags,
                    postTarget.getInteger("bookmark"),
                    postTarget.getInteger("pages_read")
            );
        }
    }

    public ResponseEntity<String> removePostRedis(String key) {
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        String response = null;

        long res = jedis.del(key);

        if (res == 1)
            response = "Post delete: " + key;
        else if (res == 0)
            response = "post not delete: " + key;
        return ResponseEntity.ok(response);
    }

    // TODO: cambiare, non può basarsi solo sull'_id del post. Deve usare l'username e la data di aggiunta
    public ResponseEntity<String> removePostMongo(ObjectId id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");
        Document query = new Document("_id", id);
        Document target = collection.find(query).first();
        String response;
        if (target != null) {
            collection.deleteOne(target);
            response = "post successful remove";
        } else
            response = "failed to remove the post";
        return ResponseEntity.ok(response);
    }

    /**
     * This method retrieves some posts of the user's friends
     *
     * @param username the username of the user
     * @return List<PostDTO>
     */
    public List<PostDTO> getRecentFriendsPosts(String username) {
        List<PostDTO> postsTarget = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("Users");

        List<Document> posts = collection.aggregate(List.of(
                new Document("$match", new Document("_id", username)),
                new Document("$unwind", new Document("path", "$friends_posts")),
                new Document("$sort", new Document("friends_posts.date_added", -1L)),
                new Document("$project",
                        new Document("_id", 0)
                                .append("book_id", "$friends_posts.book_id")
                                .append("rating", "$friends_posts.rating")
                                .append("review_text", "$friends_posts.review_text")
                                .append("date_added", "$friends_posts.date_added")
                                .append("book_title", "$friends_posts.book_title")
                                .append("username", "$friends_posts.username")
                                .append("tags", "$friends_posts.tags")
                                .append("bookmark", "$friends_posts.bookmark"))
        )).into(new ArrayList<>());

        System.out.println("posts: " + posts);

        if (posts.isEmpty()) {
            return new ArrayList<>(0);
        } else {
            for (Document doc : posts) {
                PostDTO post = new PostDTO(
                        doc.getLong("book_id"),
                        doc.getInteger("rating"),
                        doc.getDate("date_added"),
                        doc.getString("book_title"),
                        doc.getString("username"),
                        doc.getString("review_text")
                );

                postsTarget.add(post);
            }

            return postsTarget;
        }
    }
}
