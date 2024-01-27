package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.conversions.Bson;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;

import java.time.LocalDate;
import java.time.Period;

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
    @Scheduled(fixedRate = 36000000, initialDelay = 36000000) // 10 hours in milliseconds
    public void updateMongoCompetitions() {
        logger.info("Updating MongoDB competitions...");
        jedis = RedisConfig.getSession();
        mongoCollection = MongoConfig.getCollection("Competitions");
        Bson end_dateFilter = Filters.gte("end_date", LocalDate.now());
        Bson start_dateFilter = Filters.lte("start_date", LocalDate.now());
        Bson dateFilter = Filters.and(start_dateFilter,end_dateFilter);
        //This block empties the rank field of all the active competitions so that they can be filled with the new rank
        try(MongoCursor<Document> cursor = mongoCollection.find(dateFilter).cursor())
        {
            while(cursor.hasNext())
            {
                Document comp_found = cursor.next();
                System.out.println(comp_found);
                Bson filter = Filters.eq("name",comp_found.get("name").toString());
                // Esegui l'aggiornamento utilizzando pullAll per rimuovere tutti gli elementi dall'array
                Document update = new Document("$set", new Document("rank",new ArrayList<>()));
                mongoCollection.updateOne(filter,update);
            }
        }
        catch(Exception e)
        {
            System.out.println("Catched Exceptio: " + e.getMessage());
        }
        logger.info("Cleared the rank field of the active comeptitions");
        Pipeline pipeline = jedis.pipelined();
        Response<Set<String>> keysResponse = pipeline.keys("competition:*");
        pipeline.sync();
        Set<String> keys = keysResponse.get();
        // Create a list to store all the competition, user and total page read
        ArrayList<Document> Competitions_to_change = new ArrayList<Document>();
        logger.info("Starting to create documents");
        System.out.println(keys);
        // Map to keep track of documents for every value of competition_name
        Map<String, List<Document>> mapByCompetitionName = new HashMap<>();
        for (String key : keys) {
            //competition:competition_name:username:tag->value
            logger.info("Here is the key: " + key);
            String competition_name = key.split(":")[1];
            String username = key.split(":")[2];
            Integer pages_read = Integer.parseInt(jedis.get(key));
            System.out.println(username + " " + competition_name + " " + pages_read);
            Document doc = new Document()
                    .append("competition_name", competition_name)
                    .append("username", username)
                    .append("pages_read", pages_read);
            Competitions_to_change.add(doc);
        }

            logger.info("Filling the Map");
            // Filling the map
            for (Document doc2 : Competitions_to_change) {
                String competitionName = doc2.getString("competition_name");
                mapByCompetitionName.computeIfAbsent(competitionName, k -> new ArrayList<>()).add(doc2);
            }

            ArrayList<Document> topTenForEachCompetition = new ArrayList<>();

            for (List<Document> documents : mapByCompetitionName.values()) {
                Collections.sort(documents, Comparator.comparingInt((Document doc3) -> doc3.getInteger("pages_read")).reversed());
                int count = 0;
                for (Document doc4 : documents) {
                    if (count < 10) {
                        topTenForEachCompetition.add(doc4);
                        count++;
                    } else {
                        break;
                    }
                }
            }

            for (Document competition : topTenForEachCompetition) {
                String comp_name = competition.get("competition_name").toString();
                competition.remove("competition_name");
                Bson filter = Filters.eq("name",comp_name);

                // Insert the user document into the MongoDB wishlists collection
                mongoCollection.updateOne(filter, Updates.push("rank", competition));
            }



        logger.info("MongoDB competitions updated!");
        // Insert the MongoDB wishlists for each user



    }
    @Scheduled(fixedRate =  86400000, initialDelay = 36000000) // 24 hours in milliseconds
    public void eliminateOldMongoCompetitions() {
        logger.info("Eliminating old MongoDB competitions...");
        LocalDate today = LocalDate.now();


        LocalDate OneMonthAgo = today.minus(Period.ofMonths(1));
        jedis = RedisConfig.getSession();
        mongoCollection = MongoConfig.getCollection("Competitions");
        Bson dateFilter1 = Filters.gte("end_date", OneMonthAgo);
        Bson dateFilter2 = Filters.lt("end_date", today);
        Bson dateFilter = Filters.and(dateFilter1, dateFilter2);

        try (MongoCursor<Document> cursor = mongoCollection.find(dateFilter).cursor()) {
            while (cursor.hasNext()) {
                Document comp_found = cursor.next();
                System.out.println(comp_found.get("name"));
                String keyFromMongo = "competition:" + comp_found.get("name") + ":*";
                Set<String> keys = jedis.keys(keyFromMongo);
                for (String key : keys) {
                    jedis.del(key);
                }
            }
        } catch (Exception e) {
            System.out.println("Catched Exceptio: " + e.getMessage());
        }
        logger.info("Cleared the old competition");
    }
}


        /*ArrayList<String> username = new ArrayList<>();
        for(int i = 0;i<30;i++)
        {
            String User = "Massi"+ i;
            username.add(User);
        }
        String[] comps = {"Yupiie2",

                "Yupiie",

                "January 2024 Non-fiction",

                "January 2024 Graphic",

                "January 2024 Paranormal",

                "January 2024 Poetry",

                "January 2024 Children",

                "January 2024 Fiction",


                "January 2024 History",

                "January 2024 Young-adult"
        };
        Integer point = 100;
        for(String h : comps)
        {
            for(String u : username)
            {
                String key ="competition:"+h+":"+u+":"+"INVENTEDTAG";
                jedis.set(key,point.toString());
                point++;
            }
        }*/