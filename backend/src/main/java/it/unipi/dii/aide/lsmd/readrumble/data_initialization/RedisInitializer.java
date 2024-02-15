package it.unipi.dii.aide.lsmd.readrumble.data_initialization;

import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionDTO;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;

import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;

import com.mongodb.client.MongoCollection;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.springframework.stereotype.Component;
import redis.clients.jedis.ConnectionPool;
import redis.clients.jedis.Jedis;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;

@Component
public class RedisInitializer {
    private static final Logger logger = LoggerFactory.getLogger(RedisInitializer.class);

    /**
     * This method loads the wishlists from MongoDB to Redis if Redis is empty.
     *
    @PostConstruct
    public void loadWishlistsFromMongoToRedis() {
        logger.info("Loading wishlists from MongoDB to Redis...");

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        MongoCollection<Document> mongoWishlists = MongoConfig.getCollection("Wishlists");

        // Search in the cluster if the keys are already present using the scan method
        List<String> keys = KeysTwo(jedis, "wishlist:*");

        System.out.println(keys.size());

        System.out.println("Loading keys...");

        List<Document> documents = new ArrayList<>();
        mongoWishlists.find(
                // Document with username = PaSmit597, ChLyon739, TamRodg294, SeaFreema277, DaniePe851, AlberOlse106, TonyWood871
                // SusaBro835, SaraAn458, ChristiHorto729, CiFo165, StephanMo882, JesusDan442, AnnaMille88, JesuHud503, DeborBarn562
                // AndrC1428, KenneBut159, CrCisne396, JessiHernan256, ChriCar452, ThoHernande359, AaroDur518, SaMo15
                new Document("_id", new Document("$in", Arrays.asList("PaSmit597", "ChLyon739", "TamRodg294", "SeaFreema277",
                        "DaniePe851", "AlberOlse106", "TonyWood871", "SusaBro835", "SaraAn458", "ChristiHorto729",
                        "CiFo165", "StephanMo882", "JesusDan442", "AnnaMille88", "JesuHud503", "DeborBarn562",
                        "AndrC1428", "KenneBut159", "CrCisne396", "JessiHernan256", "ChriCar452", "ThoHernande359",
                        "AaroDur518", "SaMo15")))
        ).into(documents);

        System.out.println("Docs to save: " + documents.size() + "\n");

        int i = 0;

        for (Document doc : documents) {
            System.out.print("\rSaving doc " + i + " of " + documents.size());
            i++;

            String username = doc.getString("_id");
            List<Document> books = (List<Document>) doc.get("books");

            for (Document book : books) {
                String book_id = book.getLong("book_id").toString();
                String book_title = book.getString("book_title");
                String num_pages = book.getInteger("num_pages").toString();
                List<String> tagList = (List<String>) book.get("tags");
                String tags = String.join(",", tagList.toArray(new String[0]));

                Map<String, String> fields = new HashMap<>();
                fields.put("book_title", book_title);
                fields.put("num_pages", num_pages);
                fields.put("tags", tags);

                jedis.hset("wishlist:" + username + ":" + book_id, fields);
            }
        }

        logger.info("Wishlists loaded from MongoDB to Redis.");
    }
    */
}