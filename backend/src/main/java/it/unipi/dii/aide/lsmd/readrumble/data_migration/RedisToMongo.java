package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import com.mongodb.client.AggregateIterable;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.utils.SemaphoreRR;
import it.unipi.dii.aide.lsmd.readrumble.utils.Status;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;
import org.springframework.data.mongodb.core.aggregation.AggregationOptions;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.bson.conversions.Bson;
import org.bson.Document;

import redis.clients.jedis.*;

import com.mongodb.MongoException;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.MongoCollection;


import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;
import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;
import java.util.Arrays;

@Component
public class RedisToMongo {
    private static Logger logger = LoggerFactory.getLogger(RedisToMongo.class);
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

        Map<String, List<Document>> userWishlists;

        try {
            jedis = RedisConfig.getSession();
            //JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
            mongoCollection = MongoConfig.getCollection("Wishlists");

            mongoCollection.deleteMany(new Document());

            Transaction transaction = jedis.multi();
            Response<Set<String>> keysResponse = transaction.keys("wishlist:*");
            transaction.exec();

            Set<String> keys = keysResponse.get();

            //Set<String> keys = KeysTwo(jedis,"wishlist:*")

            // Create a map to store the wishlists of each user
            userWishlists = new HashMap<>();

            for (String key : keys) {
                String username = key.split(":")[1];

                Transaction transactionForHGetAll = jedis.multi();
                Response<Map<String, String>> fieldsResponse = transactionForHGetAll.hgetAll(key);
                transactionForHGetAll.exec();

                Map<String, String> fields = fieldsResponse.get();

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
        } catch (Exception e) {
            logger.error("Error while updating MongoDB wishlists: " + e.getMessage());
            return;
        }

        List<Document> userDocs = new ArrayList<>();

        // Create the MongoDB wishlists for each user
        for (Map.Entry<String, List<Document>> entry : userWishlists.entrySet()) {
            String username = entry.getKey();
            List<Document> wishlist = entry.getValue();

            Document userDoc = new Document("_id", username)
                    .append("books", wishlist);

            // Add the user document to the list
            userDocs.add(userDoc);
        }

        mongoCollection.insertMany(userDocs);

        logger.info("MongoDB wishlists updated!");
    }

    /**
     * This method is scheduled to run every 2 hours.
     * It updates the MongoDB competitions collection with the data from Redis.
     */
    @Scheduled(fixedRate = 36000000, initialDelay = 36000000) // 10 hours in milliseconds
    public void updateMongoCompetitions() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        logger.info("Updating MongoDB competitions...");
        //jedis = RedisConfig.getSession();
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        mongoCollection = MongoConfig.getCollection("Competitions");
        Bson end_dateFilter = Filters.gte("end_date", LocalDate.now());
        Bson start_dateFilter = Filters.lte("start_date", LocalDate.now());
        Bson dateFilter = Filters.and(start_dateFilter, end_dateFilter);
        //This block empties the rank field of all the active competitions so that they can be filled with the new rank
        try (MongoCursor<Document> cursor = mongoCollection.find(dateFilter).cursor()) {
            while (cursor.hasNext()) {
                Document comp_found = cursor.next();
                Bson filter = Filters.eq("name", comp_found.get("name").toString());
                Document update = new Document("$set", new Document("rank", new ArrayList<>()));
                mongoCollection.updateOne(filter, update);
            }
        } catch (Exception e) {
            System.out.println("Catched Exception: " + e.getMessage());
        }
        logger.info("Cleared the rank field of the active competitions");
        ArrayList<Document> Competitions_to_change = new ArrayList<>();
        logger.info("Starting to create documents");
        String pattern = "competition:*";
        Set<String> keys = KeysTwo(jedis,pattern);
        // Create a list to store all the competition, user and total page read
        for (String key : keys) {
            //competition:competition_name:username:tag->value
            String competition_name = key.split(":")[1];
            String username = key.split(":")[2];
            Integer tot_pages = Integer.parseInt(jedis.get(key));
            Document doc = new Document()
                    .append("competition_name", competition_name)
                    .append("username", username)
                    .append("tot_pages", tot_pages);
            Competitions_to_change.add(doc);
        }
        // Map to keep track of documents for every value of competition_name
        Map<String, List<Document>> mapByCompetitionName = new HashMap<>();
        logger.info("Filling the Map");
        // Filling the map
        for (Document doc2 : Competitions_to_change) {
            String competitionName = doc2.getString("competition_name");
            mapByCompetitionName.computeIfAbsent(competitionName, k -> new ArrayList<>()).add(doc2);
        }

        ArrayList<Document> topTenForEachCompetition = new ArrayList<>();

        for (List<Document> documents : mapByCompetitionName.values()) {
            documents.sort(Comparator.comparingInt((Document doc3) -> doc3.getInteger("tot_pages")).reversed());
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
            Bson filter = Filters.eq("name", comp_name);

            // Insert the user document into the MongoDB wishlists collection
            mongoCollection.updateOne(filter, Updates.push("rank", competition));
        }
        logger.info("MongoDB competitions updated!");
        semaphore.release();
    }
    /*
        The next function is commented beacuse it's only purpose is to fill the redis dbs with active
        competitions key-value pairs of January 2024, we decided to leave it here commented to have a ready to use
        function to re-fill the dbs for debugging purposes in case of errors

    @Scheduled(fixedRate = 36000000, initialDelay = 36000000)
    public void InsertIntoRedisCompetitionsCreated() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        logger.info("Inserting things into redis");
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        mongoCollection = MongoConfig.getCollection("ActiveBooks");
        logger.info("Before Deleting keys from redis");
        //Pipeline pipeline = jedis.pipelined();
        //Response<Set<String>> keysResponse = pipeline.keys("competition:*");
        //pipeline.sync();
        //Set<String> keys = keysResponse.get();
        //for(String key: keys)
        //{
        //jedis.del(key);
        //}
        //logger.info("After keys deletion");
        AggregateIterable<Document> result = mongoCollection.aggregate(Arrays.asList(
                new Document("$match",
                        new Document("year", 2024L)
                                .append("month", 1L)),
                new Document("$unwind",
                        new Document("path", "$books")),
                new Document("$unwind",
                        new Document("path", "$books.tags")),
                new Document("$group",
                        new Document("_id",
                                new Document("username", "$username")
                                        .append("year", "$year")
                                        .append("month", "$month")
                                        .append("tag", "$books.tags"))
                                .append("tot_pages",
                                        new Document("$sum", "$books.pages_read"))),
                new Document("$project",
                        new Document("_id", 0L)
                                .append("username", "$_id.username")
                                .append("year", "$_id.year")
                                .append("month", "$_id.month")
                                .append("tag", "$_id.tag")
                                .append("tot_pages", "$tot_pages")),
                new Document("$sort",
                        new Document("tot_pages", -1L))
        )).allowDiskUse(true);
        mongoCollection = MongoConfig.getCollection("Competitions");
        logger.info("After Aggregation and Before inserting");
        for (Document doc : result) {
            logger.info("Inside doc : result");
            String username = (String) doc.get("username");
            String tag = (String) doc.get("tag");
            String TagTag = tag.substring(0, 1).toUpperCase() + tag.substring(1);
            Integer month = (Integer) doc.get("month");
            Integer year = (Integer) doc.get("year");
            Integer pages_read = (Integer) doc.get("tot_pages");
            String dataString = year.toString() + "-" + month.toString() + "-" + "15"; // Data sotto forma di stringa
            SimpleDateFormat formatoData = new SimpleDateFormat("yyyy-MM-dd");

            try {
                // Analizza la stringa nella data
                Date data = formatoData.parse(dataString);
                Bson tagFilter = Filters.eq("tag", TagTag);
                Bson startDateFilter = Filters.lte("start_date", data);
                Bson endDateFilter = Filters.gte("end_date", data);
                Bson dateFilter = Filters.and(startDateFilter, endDateFilter);
                Bson filter = Filters.and(dateFilter, tagFilter);
                Document Comp = mongoCollection.find(filter).first();
                if (Comp != null) {
                    String CompName = (String) Comp.get("name");
                    if (!CompName.isEmpty()) {
                        String key = "competition:" + CompName + ":" + username + ":" + TagTag;
                        jedis.set(key, pages_read.toString());
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                logger.info("After inserting");
                semaphore.release();
            }
        }
    }
    */

    /**
     * This method is scheduled to run every 24 hours.
     * It eliminates the old competitions from Redis and MongoDB.
     */
    @Scheduled(fixedRate = 86400000, initialDelay = 36000000) // 24 hours in milliseconds
    public void eliminateOldMongoCompetitions() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        logger.info("Eliminating old MongoDB competitions...");
        LocalDate today = LocalDate.now();
        LocalDate OneMonthAgo = today.minus(Period.ofMonths(1));
        //jedis = RedisConfig.getSession();
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        mongoCollection = MongoConfig.getCollection("Competitions");
        Bson dateFilter1 = Filters.gte("end_date", OneMonthAgo);
        Bson dateFilter2 = Filters.lt("end_date", today);
        Bson dateFilter = Filters.and(dateFilter1, dateFilter2);

        try (MongoCursor<Document> cursor = mongoCollection.find(dateFilter).cursor()) {
            while (cursor.hasNext()) {
                Document comp_found = cursor.next();
                System.out.println(comp_found.get("name"));
                String keyFromMongo = "competition:" + comp_found.get("name") + ":*";
                Set<String> keys = KeysTwo(jedis,keyFromMongo);
                ScanParams scanParams = new ScanParams().match(keyFromMongo);
                String redisCursor = "0";
                for (String key : keys) {
                    jedis.del(key);
                }
            }
        } catch (Exception e) {
            System.out.println("Catched Exception: " + e.getMessage());
        } finally {
            logger.info("Cleared the old competition");
            semaphore.release();
        }

    }

    @Scheduled(fixedRate = 900000, initialDelay = 36000000) // 15 minutes in milliseconds
    public void updateMongoPost() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("#---------------- START UPDATE POST IN MONGO ---------------------------#");
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        //Jedis jedis = RedisConfig.getSession();
        isoFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        try {
            MongoCollection<Document> collection1 = MongoConfig.getCollection("Posts");
            MongoCollection<Document> collection2 = MongoConfig.getCollection("ActiveBooks");


            Set<String> keys = KeysTwo(jedis,"post:*");
            List<Document> posts = new ArrayList<>();

            for (String key : keys) {
                Map<String, String> postData = jedis.hgetAll(key);
                String[] keySplit = key.split(":");
                if (postData != null && !postData.isEmpty()) {


                    LocalDateTime now = LocalDateTime.now();
                    int postHour = Integer.parseInt(keySplit[1]);
                    int postMinute = Integer.parseInt(keySplit[2]);
                    int postSecond = Integer.parseInt(keySplit[3]);

                    if (now.getHour() < postHour ||
                            (now.getHour() == postHour && now.getMinute() < postMinute) ||
                            (now.getHour() == postHour && now.getMinute() == postMinute && now.getSecond() < postSecond)) {
                        now = now.minusDays(1);
                    }

                    now = now.withHour(postHour).withMinute(postMinute).withSecond(postSecond);
                    System.out.println("post key is: " + key);
                    Document new_doc = new Document("book_id", Long.parseLong(keySplit[5]))
                            .append("rating", keySplit[6])
                            .append("review_text", postData.get("review_text"))
                            .append("date_added", isoFormat.format(now))
                            .append("book_title", postData.get("book_title"))
                            .append("username", keySplit[4])
                            .append("tags", postData.get("tags"))
                            .append("bookmark", Integer.parseInt(keySplit[7]))
                            .append("pages_read", Integer.parseInt(keySplit[8]));
                    //add the document into the post list
                    posts.add(new_doc);


                    //current year and month
                    int year = now.getYear();
                    int month = now.getMonthValue();
                    Document query = new Document("username", keySplit[4])
                            .append("year", year).append("month", month);
                    Document userDocument = collection2.find(query).first();
                    Document lb = null;
                    if (userDocument != null) {
                        List<Document> books = (List<Document>) userDocument.get("books");
                        int index = 0;
                        for (Document book : books) {
                            if (Long.parseLong(keySplit[5]) == book.getLong("book_id")) {
                                lb = book;
                                break;
                            }
                            index++;
                        }
                        int new_bookmark = Integer.parseInt(keySplit[7]);
                        int new_pages_read = lb.getInteger("pages_read") + Integer.parseInt(keySplit[8]);
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
            semaphore.release();
        }

    }

}