package it.unipi.dii.aide.lsmd.readrumble.post;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;

import com.google.gson.Gson;

import org.bson.Document;
import org.bson.types.ObjectId;

import org.springframework.http.ResponseEntity;

import com.mongodb.client.MongoCollection;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;
import java.util.Locale;
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

        //String key = "competition:"+competitionTitle + ":" + competitionTag + ":" + username;

        int i = 0;
        int j = 0;
        for (; !competitions_names.isEmpty() && i < competitions_names.size() && j < competitions_tag.size(); i++, j++) {
            String compkey = "competition:" + competitions_names.get(i) + ":" + competitions_tag.get(j) + ":" + username;
            String value = jedis.get(compkey);
            int new_pages_read = Integer.parseInt(value) + pagesRead;

            jedis.set(compkey, String.valueOf(new_pages_read));
        }

        return ResponseEntity.ok("Post added: " + key);
    }

    public List<PostDTO> allPostsUser(String parameter, boolean user, boolean loadAll) {
        MongoCollection<Document> collection;
        Document query;

        if (user) {
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
            if (user) {
                String username = doc.getString("_id");

                post = new PostDTO(
                        postDoc.get("_id").toString(),
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
                        postDoc.get("_id").toString(),
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

    public Post postDetails(ObjectId id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        Document query = new Document("_id", id);

        Document doc = collection.find(query).first();

        assert doc != null;

        List<String> tags = (List<String>) doc.get("tags");
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

        for (Document doc : collection.find().sort(new Document("date_added", -1)).limit(10)) {
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

        return reviews;
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
     * this aggregation will return a list of documents containing information about books reviewed by friends,
     * including the book ID, rating, date added, book title,
     * username of the review author, and text of the review.
     * @param friends
     * @return List<PostDTO>
     */
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
