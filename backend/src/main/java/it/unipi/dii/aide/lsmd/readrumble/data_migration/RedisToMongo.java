package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import com.mongodb.MongoException;
import it.unipi.dii.aide.lsmd.readrumble.utils.Status;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class RedisToMongo {
    private static final Logger logger = LoggerFactory.getLogger(RedisToMongo.class);

    private Jedis jedis;
    private MongoCollection<Document> mongoCollection;
    private DateTimeFormatter isoFormat;


    /**
     * This method is scheduled to run every 2 hours.
     * It updates the MongoDB wishlist collection with the data from Redis.
     */
    @Scheduled(fixedRate = 36000000, initialDelay = 36000000) // 10 hours in milliseconds
    public void updateMongoWishlists() {
        logger.info("Updating MongoDB wishlists...");

        jedis = RedisConfig.getSession();
        mongoCollection = MongoConfig.getCollection("Wishlists");

        // Clear the entire wishlists collection
        mongoCollection.deleteMany(new Document());

        Pipeline pipeline = jedis.pipelined();
        Response<Set<String>> keysResponse = pipeline.keys("wishlist:*");

        pipeline.sync();

        Set<String> keys = keysResponse.get();

        // Create a map to store the wishlists of each user
        Map<String, List<Document>> userWishlists = new HashMap<>();

        for (String key : keys) {
            String username = key.split(":")[1];

            // Get all the fields and their values for the current key
            Map<String, String> fields = jedis.hgetAll(key);

            // Convert the tags string into an array of strings (the tags are separated by commas)
            String tagsField = fields.get("tags");
            List<String> tags = tagsField != null ? Arrays.asList(tagsField.split(",")) : new ArrayList<>();

            Document doc = new Document()
                    .append("book_id", Long.parseLong(fields.get("book_id")))
                    .append("book_title", fields.get("book_title"))
                    .append("num_pages", Integer.parseInt(fields.get("num_pages")))
                    .append("tags", tags);

            // Add the Document to the user's wishlist in the map
            userWishlists.computeIfAbsent(username, k -> new ArrayList<>()).add(doc);
        }

        // Insert the MongoDB wishlists for each user
        for (Map.Entry<String, List<Document>> entry : userWishlists.entrySet()) {
            String username = entry.getKey();
            List<Document> wishlist = entry.getValue();

            Document userDoc = new Document("_id", username)
                    .append("books", wishlist);

            // Insert the user document into the MongoDB wishlists collection
            mongoCollection.insertOne(userDoc);
        }

        logger.info("MongoDB wishlists updated!");
    }

    // TODO: favoriteBooks

    // TODO: following

    /**
     * This method is scheduled to run every 2 hours.
     * It updates the MongoDB competition collection with the data from Redis.
     *
    @Scheduled(fixedRate = 36000000) // 1 hour in milliseconds
    public void updateMongoCompetitions() {
        logger.info("Updating MongoDB competitions...");

        jedis = RedisConfig.getSession();
        mongoCollection = MongoConfig.getCollection("Competitions");

        Set<String> keys = jedis.keys("competition:*");

        // Create a map to store the keys and their associated values
        Map<String, Integer> keyValueMap = new HashMap<>();

        // Create a set to keep track of the competitions whose ranks have been cleared
        Set<String> clearedCompetitions = new HashSet<>();

        for (String key : keys) {
            // Get the value associated with the key
            int value = Integer.parseInt(jedis.get(key));
            keyValueMap.put(key, value);
        }

        // Sort the map by values in descending order and get the top 10 entries
        List<Map.Entry<String, Integer>> topEntries = keyValueMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(10)
                .toList();

        for (Map.Entry<String, Integer> entry : topEntries) {
            String competitionName = entry.getKey().split(":")[1];
            int score = entry.getValue();

            // Clear the MongoDB competition rank for the competition only if it hasn't been cleared yet
            if (!clearedCompetitions.contains(competitionName)) {
                mongoCollection.updateOne(new Document("_id", competitionName), new Document("$set", new Document("rank", new ArrayList<>())));
                clearedCompetitions.add(competitionName);
            }

            Document doc = new Document()
                    .append("username", competitionName)
                    .append("pages_read", score);

            // Add the Document to the array rank in the MongoDB document with _id equal to the competitionName
            mongoCollection.updateOne(new Document("_id", competitionName), new Document("$addToSet", new Document("rank", doc)));
        }

        logger.info("MongoDB competitions updated!");
    }*/
    @Scheduled(fixedRate = 7200000) // 2 hours in milliseconds
    public void updateMongoPost() {
        Jedis jedis = RedisConfig.getSession();
        isoFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        try {
            MongoCollection<Document> collection1 = MongoConfig.getCollection("Posts");
            MongoCollection<Document> collection2 = MongoConfig.getCollection("ActiveBooks");


            Set<String> keys = jedis.keys("post:*");
            List<Document> posts = new ArrayList<>();

            for (String key : keys) {
                Map<String, String> postData = jedis.hgetAll(key);
                String[] keySplit = key.split(":");
                if (postData != null && !postData.isEmpty()) {


                    LocalDateTime now = LocalDateTime.now();
                    String postTime = key.split(":")[1] + ":" + key.split(":")[2] + ":" + key.split(":")[3];
                    String[] timeParts = postTime.split(":");
                    int postHour = Integer.parseInt(timeParts[0]);
                    int postMinute = Integer.parseInt(timeParts[1]);
                    int postSecond = Integer.parseInt(timeParts[2]);

                    if (now.getHour() < postHour ||
                            (now.getHour() == postHour && now.getMinute() < postMinute) ||
                            (now.getHour() == postHour && now.getMinute() == postMinute && now.getSecond() < postSecond)) {
                        now = now.minusDays(1);
                    }

                    now = now.withHour(postHour).withMinute(postMinute).withSecond(postSecond);

                    Document new_doc = new Document("book_id", Long.parseLong(keySplit[3]))
                            .append("rating", keySplit[4])
                            .append("review_text", postData.get("review_text"))
                            .append("date_added", isoFormat.format(now))
                            .append("book_title", postData.get("book_title"))
                            .append("username", keySplit[2])
                            .append("tags", postData.get("tags"))
                            .append("bookmark", Integer.parseInt(keySplit[5]))
                            .append("pages_read", Integer.parseInt(keySplit[6]));
                    //add the document into the post list
                    posts.add(new_doc);


                    //current year and month
                    int year = now.getYear();
                    int month = now.getMonthValue();
                    Document query = new Document("username", keySplit[2])
                            .append("year", year).append("month", month);
                    Document userDocument = collection2.find(query).first();
                    Document lb = null;
                    if (userDocument != null) {
                        List<Document> books = (List<Document>) userDocument.get("books");
                        int index = 0;
                        for (Document book : books) {
                            if (Long.parseLong(keySplit[3]) == book.getLong("book_id")) {
                                lb = book;
                                break;
                            }
                            index++;
                        }
                        int new_bookmark = Integer.parseInt(keySplit[5]);
                        int new_pages_read = lb.getInteger("pages_read") + Integer.parseInt(keySplit[6]);
                        lb.put("bookmark", new_bookmark);
                        lb.put("pages_read", new_pages_read);
                        //update che active book with the new bookmark
                        //if the book is finish we need to update the status of the book
                        //0: not finish yet, 1: finish
                        if (new_bookmark == lb.getInteger("num_pages"))
                            lb.put("state", Status.FINISHED);

                        collection2.updateOne(query, new Document("$set", new Document("books." + index, lb)));
                    } else {
                        System.err.println("book not found in the user's library");
                    }
                }
                //insert the posts into mongoDB
                collection1.insertMany(posts);
                //delete the redis key
                jedis.del(key);
            }
        } catch (MongoException e) {
            e.printStackTrace();
        } finally {
            jedis.close();
        }
    }

}