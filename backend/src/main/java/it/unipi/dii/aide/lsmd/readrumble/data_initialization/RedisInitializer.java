package it.unipi.dii.aide.lsmd.readrumble.data_initialization;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;

import com.mongodb.client.MongoCollection;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.JedisCluster;

@Component
public class RedisInitializer {
    private static final Logger logger = LoggerFactory.getLogger(RedisInitializer.class);

    /**
     * This method loads the wishlists from MongoDB to Redis if Redis is empty.
     */
    @PostConstruct
    public void loadWishlistsFromMongoToRedis() {
        logger.info("Loading wishlists from MongoDB to Redis...");

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        MongoCollection<Document> mongoWishlists = MongoConfig.getCollection("Wishlists");

        if (false /*jedis.keys("wishlist:*").isEmpty()*/) {
            List<Document> documents = new ArrayList<>();
            mongoWishlists.find().into(documents);

            for (Document doc : documents) {
                String username = doc.getString("_id");
                List<Document> books = (List<Document>) doc.get("books");

                for (Document book : books) {
                    String book_id = book.getLong("book_id").toString();
                    String book_title = book.getString("book_title");
                    String num_pages = book.getInteger("num_pages").toString();
                    List<String> tagList = (List<String>) book.get("tags");
                    String tags = String.join(",", tagList.toArray(new String[0]));

                    Map<String, String> fields = new HashMap<>();
                    fields.put("book_id", book_id);
                    fields.put("book_title", book_title);
                    fields.put("num_pages", num_pages);
                    fields.put("tags", tags);

                    jedis.hset("wishlist:" + username + ":" + book_id, fields);
                }
            }

            logger.info("Wishlists loaded from MongoDB to Redis.");
        } else {
            logger.info("Wishlists already loaded in Redis.");
        }

    }
}