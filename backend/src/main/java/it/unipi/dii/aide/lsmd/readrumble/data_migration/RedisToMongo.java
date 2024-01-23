package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import java.util.*;

@Component
public class RedisToMongo {

    private Jedis jedis;
    private MongoCollection<Document> mongoCollection;

    /**
     * This method is scheduled to run every 2 hours.
     * It updates the MongoDB wishlist collection with the data from Redis.
     */
    @Scheduled(fixedRate = 36000000) // 10 hours in milliseconds
    public void updateMongoWishlists() {
        jedis = RedisConfig.getSession();
        mongoCollection = MongoConfig.getCollection("Wishlists");

        Set<String> keys = jedis.keys("wishlist:*");

        for (String key : keys) {
            String username = key.split(":")[1];

            // Clear the MongoDB wishlist for the user
            mongoCollection.updateOne(new Document("_id", username), new Document("$set", new Document("books", new ArrayList<>())));

            // Get all the fields and their values for the current key
            Map<String, String> fields = jedis.hgetAll(key);

            // Convert the tags string into an array of strings (the tags are separated by commas)
            List<String> tags = Arrays.asList(fields.get("tags").split(","));

            Document doc = new Document()
                    .append("book_id", Integer.parseInt(fields.get("book_id")))
                    .append("book_title", fields.get("book_title"))
                    .append("num_pages", Integer.parseInt(fields.get("num_pages")))
                    .append("tags", tags);

            // Add the Document to the array books in the MongoDB document with _id equal to the username
            mongoCollection.updateOne(new Document("_id", username), new Document("$addToSet", new Document("books", doc)));
        }
    }
}