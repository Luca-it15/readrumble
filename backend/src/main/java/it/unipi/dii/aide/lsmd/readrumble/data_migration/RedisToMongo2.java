package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class RedisToMongo2 {
    private static final Logger logger = LoggerFactory.getLogger(RedisToMongo.class);

    private Jedis jedis;
    private MongoCollection<Document> mongoCollection;

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
}