package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import com.mongodb.client.AggregateIterable;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionDAO;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.utils.SemaphoreRR;

import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;

import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Values;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import org.bson.conversions.Bson;
import org.bson.Document;

import redis.clients.jedis.JedisCluster;

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

@Component
public class RedisToMongo {
    private static Logger logger = LoggerFactory.getLogger(RedisToMongo.class);
    private MongoCollection<Document> mongoCollection;
    private DateTimeFormatter isoFormat;
    private AdminCompetitionDAO adminCompetitionDAO;

    public RedisToMongo() {
        adminCompetitionDAO = new AdminCompetitionDAO();
    }

    /**
     * This method is scheduled to run every 2 hours.
     * It updates the MongoDB wishlist collection with the data from Redis.
     */
    @Scheduled(fixedRate = 36000000, initialDelay = 36000000) // 10 hours in milliseconds
    public void updateMongoWishlists() {
        logger.info("Updating MongoDB wishlists...");

        Map<String, List<Document>> userWishlists;

        try {
            JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
            mongoCollection = MongoConfig.getCollection("Wishlists");

            mongoCollection.deleteMany(new Document());

            List<String> keys = KeysTwo(jedis, "wishlist:*");

            // Create a map to store the wishlists of each user
            userWishlists = new HashMap<>();

            for (String key : keys) {
                String username = key.split(":")[1];
                Long book_id = Long.parseLong(key.split(":")[2]);

                Map<String, String> fields = jedis.hgetAll(key);

                // Convert the tags string into an array of strings (the tags are separated by commas)
                String tagsField = fields.get("tags");
                List<String> tags = tagsField != null ? Arrays.asList(tagsField.split(",")) : new ArrayList<>();

                Document doc = new Document()
                        .append("book_id", Long.parseLong(String.valueOf(book_id)))
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
     this quoted function empties redis databases from the competition:* key-value pairs. It is used only for debugging purposes
     in order to empty and successively fill the databases with the correct pairs.
     */

    public void EmptyCompetitionsFromRedis()
    {
        logger.info("Empty Redis Competitions");
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        String pattern = "competition:*";
        List<String> keys = KeysTwo(jedis, pattern);
        // Create a list to store all the competition, user and total page read
        for (String key : keys) {
            jedis.del(key);
        }
        logger.info("Redis Competitions Emptied");
    }
    /**
     * This method is scheduled to run every 2 hours.
     * It updates the MongoDB competitions collection with the data from Redis.
     */
    @Scheduled(fixedRate = 36000000, initialDelay = 36000000) // 10 hours in milliseconds
    public void updateFriendsPosts() {
        logger.info("Updating MongoDB Friends Posts ");
        //modify Users in Users
        mongoCollection = MongoConfig.getCollection("Users");
        int i = 0;
        int c = 0;
        try (MongoCursor<Document> cursor = mongoCollection.find().cursor()) {
            String username;
            while (cursor.hasNext()) {
                username = cursor.next().get("_id").toString();
                ArrayList<Document> friendsposts = new ArrayList<>();
                try (Session session = Neo4jConfig.getSession()) {
                    Result result = session.run("MATCH (u:User {name: $username})-[:FOLLOWS]->(f:User) RETURN f.name AS following",
                            Values.parameters("username", username));

                    List<String> following = new ArrayList<>();

                    while (result.hasNext()) {
                        following.add(result.next().get("following").asString());
                    }
                    Collections.shuffle(following);
                    int index = 10;
                    if(following.size()<index)
                    {
                        index = following.size();
                    }
                    List<String> following2 = following.subList(0, index);
                    //now we have the list of friends for the user selected, we need to take the first post of each friend
                    //sort them by the date added and take the first twenty
                    //first, it is necessary to eliminate the previous posts
                    Bson filter = Filters.eq("_id", username);
                    Document update = new Document("$set", new Document("friends_posts", new ArrayList<>()));
                    mongoCollection.updateOne(filter, update);

                    AggregateIterable<Document> result2 = mongoCollection.aggregate(Arrays.asList(new Document("$match", new Document("_id", new Document("$in", following2))),
                            new Document("$sort",
                                    new Document("recent_posts.date_added.0", -1L)),
                            new Document("$unwind",
                                    new Document("path", "$recent_posts")),
                            new Document("$match",
                                    new Document("recent_posts.rating",
                                            new Document("$gte", 1L))),
                            new Document("$group",
                                    new Document("_id", "$_id")
                                            .append("post",
                                                    new Document("$first", "$recent_posts"))),
                            new Document("$project",
                                    new Document("_id", "$post._id")
                                            .append("book_id", "$post.book_id")
                                            .append("rating", "$post.rating")
                                            .append("review_text", "$post.review_text")
                                            .append("date_added", "$post.date_added")
                                            .append("book_title", "$post.book_title")
                                            .append("username", "$_id")
                                            .append("tags", "$post.tags")
                                            .append("bookmark", "$post.bookmark")
                                            .append("pages_read", "$post.pages_read")),
                            new Document("$limit", 10L))
                    ).allowDiskUse(true);
                    // a new arraylist is created to store the posts
                    ArrayList<Document> new_friends_posts = new ArrayList<>();
                    for(Document doc : result2)
                    {
                        new_friends_posts.add(doc);
                    }
                    //now the arraylist is stored in the proper field
                    Bson filter2 = Filters.eq("_id", username);
                    Document update2 = new Document("$set", new Document("friends_posts", friendsposts));
                    mongoCollection.updateOne(filter2, update2);
                    i=i+1;
                    if(i == 1000)
                    {
                        c=c+1;
                        logger.info("Thousand : "+c);
                        i = 0;
                    }
                }
                catch (Exception e) {
                    System.out.println("Catched Exception: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.out.println("Catched Exception: " + e.getMessage());
        }
        logger.info("Finished Updating MongoDB Friends Posts !");

    }

    @Scheduled(fixedRate = 36000000, initialDelay = 36000000) // 10 hours in milliseconds
    public void updateMongoCompetitions() {
        logger.info("Updating MongoDB competitions");
        /*SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }*/
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        mongoCollection = MongoConfig.getCollection("Competitions");
        Bson end_dateFilter = Filters.gte("end_date", LocalDate.now());
        Bson start_dateFilter = Filters.lte("start_date", LocalDate.now());
        Bson dateFilter = Filters.and(start_dateFilter, end_dateFilter);
        //This block empties the rank field of all the active competitions so that they can be filled with the new rank
        try (MongoCursor<Document> cursor = mongoCollection.find(/*dateFilter*/).cursor()) {
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

        mongoCollection = MongoConfig.getCollection("Users");

        try (MongoCursor<Document> cursor = mongoCollection.find().cursor()) {
            while (cursor.hasNext()) {
                Document user = cursor.next();
                Bson filter2 = Filters.eq("_id", user.get("_id").toString());
                Document update2 = new Document("$set", new Document("competitions", new ArrayList<>()));
                mongoCollection.updateOne(filter2, update2);
            }
        } catch (Exception e) {
            System.out.println("Catched Exception: " + e.getMessage());
        }
        mongoCollection = MongoConfig.getCollection("Competitions");

        logger.info("Cleared the competitions field of the users");
        ArrayList<Document> Competitions_to_change = new ArrayList<>();
        logger.info("Starting to create documents");
        String pattern = "competition:*";
        List<String> keys = KeysTwo(jedis, pattern);
        // Create a list to store all the competition, user and total page read
        for (String key : keys) {
            //competition:competition_name:tag:username->value
            String competition_name = key.split(":")[1];
            String username = key.split(":")[3];
            Integer tot_pages = Integer.parseInt(jedis.get(key));
            Document doc = new Document()
                    .append("competition_name", competition_name)
                    .append("tot_pages", tot_pages);
            Bson filter = Filters.eq("_id", username);
            //this code inserts the competition into the 'competitions' field in the document user
            // this code has a cool feature : since it uses Redis for the values, it is possible to store in the document
            // all the competitions wanted, even the finished ones !
            MongoConfig.getCollection("Users").updateOne(filter, Updates.push("competitions", doc));
            //this other field is inserted to then proceed in the evaluation of the top ten
            doc.append("username", username);

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
        //semaphore.release();
    }

    /**
        The following function is commented because its only purpose is to fill the key-value DB with the active
        competitions' key-value pairs of January 2024, we decided to leave it here as a comment to have a ready-to-use
        function to re-fill the DB for debugging purposes.
    */

    @Scheduled(fixedRate = 36000000, initialDelay = 36000000)
    public void InsertIntoRedisCompetitionsCreated() {
        logger.info("Inserting things into redis");

        Integer year2 = LocalDate.now().getYear();
        Integer month2 = LocalDate.now().getMonthValue();
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        mongoCollection = MongoConfig.getCollection("Users");

        AggregateIterable<Document> result = mongoCollection.aggregate(Arrays.asList(
                new Document("$project",
                        new Document("_id", "$_id")
                                .append("active_books", "$recent_active_books")),
                new Document("$unwind",
                        new Document("path", "$active_books")),
                new Document("$match",
                        new Document("$and", Arrays.asList(new Document("active_books.month", month2),
                                new Document("active_books.year", year2)))),
                new Document("$unwind",
                        new Document("path", "$active_books.books")),
                new Document("$unwind",
                        new Document("path", "$active_books.books.tags")),
                new Document("$group",
                        new Document("_id",
                                new Document("year", "$active_books.year")
                                        .append("month", "$active_books.month")
                                        .append("_id", "$_id")
                                        .append("tags", "$active_books.books.tags"))
                                .append("tot_pages",
                                        new Document("$sum", "$active_books.books.pages_read"))),
                new Document("$project",
                        new Document("_id", "$_id._id")
                                .append("year", "$_id.year")
                                .append("month", "$_id.month")
                                .append("pages_read", "$_id.pages_read")
                                .append("tag", "$_id.tags")
                                .append("tot_pages", "$tot_pages")))
        ).allowDiskUse(true);
        //this aggregation returns for every user the pages read in this month and year and puts them into redis, this way
        // the loading should be faster
        logger.info("aggregation executed");
        int i = 0;
        int c = 0;
        /*MongoCursor cursor = mongoCollection.find().cursor();
        while(cursor.hasNext())*/
        for(Document doc : result)
        {
            //Document doc = (Document) cursor.next();
            mongoCollection = MongoConfig.getCollection("Competitions");
                i = i+1;
                //logger.info("Inserting");
            String username = doc.get("_id").toString();
            String tag = (String) doc.get("tag").toString();
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
                            String key = "competition:" + CompName + ":" + TagTag + ":" + username;
                            jedis.set(key, pages_read.toString());
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    //logger.info("After inserting");
                    //semaphore.release();
                }
                if(i == 1000)
                {
                    c = c+1;
                    i = 0;
                    logger.info("Thousand :" + c);
                }


        }
        logger.info("finished inserting things into redis");

    }


    /**
     * This method is scheduled to run every 24 hours.
     * It eliminates the admin competitions from Redis and MongoDB.
     */
    @Scheduled(fixedRate = 86400000, initialDelay = 36000000) // 24 hours in milliseconds
    public void eliminateAdminMongoCompetitions() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        adminCompetitionDAO.eliminateCompetitions();
        semaphore.release();
    }

    /**
     * This method is scheduled to run every 24 hours.
     * It eliminates the old competitions from Redis and MongoDB.
     */
    @Scheduled(fixedRate = 86400000, initialDelay = 36000000) // 24 hours in milliseconds
    public void eliminateOldMongoCompetitions() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);

        try { semaphore.acquire(); }
        catch (InterruptedException e) { e.printStackTrace(); }

        logger.info("Eliminating old MongoDB competitions...");

        LocalDate today = LocalDate.now();
        LocalDate OneMonthAgo = today.minus(Period.ofMonths(1));

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        mongoCollection = MongoConfig.getCollection("Competitions");

        Bson dateFilter1 = Filters.gte("end_date", OneMonthAgo);
        Bson dateFilter2 = Filters.lt("end_date", today.minusDays(5));
        Bson dateFilter = Filters.and(dateFilter1, dateFilter2);
        //if you want to deep clean, substitute .find(dateFilter) with .find(dateFilter2)
        try (MongoCursor<Document> cursor = mongoCollection.find(dateFilter).cursor()) {
            while (cursor.hasNext()) {
                Document comp_found = cursor.next();
                String keyFromMongo = "competition:" + comp_found.get("name") + ":*";
                List<String> keys = KeysTwo(jedis, keyFromMongo);
                for (String key : keys) {
                    jedis.del(key);
                    //Since the competitions are updated in redis and all the fields of competitions in users are emptied
                    //at each update, there is no need to eliminate old competitions from users
                }
            }
        } catch (Exception e) {
            logger.error("Catched Exception: " + e.getMessage());
        } finally {
            logger.info("Cleared the old competition");
            semaphore.release();
        }
    }

    @Scheduled(fixedRate = 900000, initialDelay = 36000000) // 15 minutes in milliseconds
    public void updateMongoPost() {
        SemaphoreRR semaphore = SemaphoreRR.getInstance(1);

        try { semaphore.acquire(); }
        catch (InterruptedException e) { e.printStackTrace(); }

        logger.info("Starting to update MongoDB Posts...");

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        isoFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        try {
            MongoCollection<Document> collectionPosts = MongoConfig.getCollection("Posts");
            MongoCollection<Document> collectionActiveBooks = MongoConfig.getCollection("ActiveBooks");

            List<String> PostKeys = KeysTwo(jedis, "post:*");
            List<Document> posts = new ArrayList<>();

            for (String key : PostKeys) {
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

                    Document new_doc = new Document("book_id", Long.parseLong(keySplit[5]))
                            .append("rating", keySplit[6])
                            .append("review_text", postData.get("review_text"))
                            .append("date_added", isoFormat.format(now))
                            .append("book_title", postData.get("book_title"))
                            .append("username", keySplit[4])
                            .append("tags", postData.get("tags"))
                            .append("bookmark", Integer.parseInt(keySplit[7]))
                            .append("pages_read", Integer.parseInt(keySplit[8]));
                    posts.add(new_doc);

                    int year = now.getYear();
                    int month = now.getMonthValue();

                    Document query = new Document("username", keySplit[4]).append("year", year).append("month", month);
                    Document userDocument = collectionActiveBooks.find(query).first();
                    Document book_to_update = null;

                    // If the user has started new books without making a post about them, we need to add them to ActiveBooks
                    if (jedis.exists("started:" + keySplit[4] + ":" + keySplit[5])) {
                        Map<String, String> startedBooks = jedis.hgetAll("started:" + keySplit[4] + ":" + keySplit[5]);

                        Document new_book = new Document("book_id", Long.parseLong(keySplit[5]))
                                .append("book_title", startedBooks.get("book_title"))
                                .append("num_pages", Integer.parseInt(startedBooks.get("num_pages")))
                                .append("tags", startedBooks.get("tags").split(","))
                                .append("bookmark", 0)
                                .append("pages_read", 0);

                        if (userDocument != null) {
                            List<Document> books = (List<Document>) userDocument.get("books");
                            books.add(new_book);
                            collectionActiveBooks.updateOne(query, new Document("$set", new Document("books", books)));
                        } else {
                            List<Document> books = new ArrayList<>();
                            books.add(new_book);
                            userDocument = new Document("username", keySplit[4])
                                    .append("year", year)
                                    .append("month", month)
                                    .append("books", books);
                            collectionActiveBooks.insertOne(userDocument);
                        }

                        jedis.del("started:" + keySplit[4] + ":" + keySplit[5]);
                    }

                    List<Document> books = (List<Document>) userDocument.get("books");

                    int index = 0;
                    for (Document book : books) {
                        if (Long.parseLong(keySplit[5]) == book.getLong("book_id")) {
                            book_to_update = book;
                            break;
                        }

                        index++;
                    }

                    int new_bookmark = Integer.parseInt(keySplit[7]);
                    int new_pages_read = book_to_update.getInteger("pages_read") + Integer.parseInt(keySplit[8]);

                    book_to_update.put("bookmark", new_bookmark);
                    book_to_update.put("pages_read", new_pages_read);

                    collectionActiveBooks.updateOne(query, new Document("$set", new Document("books." + index, book_to_update)));
                }

                // Insert the posts into mongoDB
                collectionPosts.insertMany(posts);

                // Delete the redis key
                jedis.del(key);
            }
        } catch (MongoException e) {
            e.printStackTrace();
        } finally {
            logger.info("MongoDB Posts and ActiveBooks updated");
            semaphore.release();
        }
    }
    //This is a debugging function that helps to try the code
    @Scheduled(fixedRate = 90000000)
    public void GoGoGo() {
        EmptyCompetitionsFromRedis();
        InsertIntoRedisCompetitionsCreated();
        updateMongoCompetitions();
        updateFriendsPosts();
        //eliminateOldMongoCompetitions();
    }
}