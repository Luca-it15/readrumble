package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.utils.FollowersAndFollowees;
import org.bson.Document;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.springframework.scheduling.annotation.Scheduled;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class Neo4jToMongo {
    private static final Logger logger = LoggerFactory.getLogger(Neo4jToMongo.class);

    /**
     * This method loads the number of followers and followees of every user from Neo4j to mongodb
     */
    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void loadFollowersAndFolloweesFromNeo4jToMongo() {
        logger.info("Loading followers and followees from Neo4j to MongoDB...");

        MongoCollection<Document> mongoUsers = MongoConfig.getCollection("Users");

        try (Session session = Neo4jConfig.getSession()) {
            Result followers = session.run("MATCH (a:User)-[r:FOLLOWS]->() RETURN a.name as username, COUNT(r) as followers");
            Result followees = session.run("MATCH (a:User)<-[r:FOLLOWS]-() RETURN a.name as username, COUNT(r) as followees");

            Map<String, FollowersAndFollowees> followersAndFollowees = new HashMap<>();

            followers.forEachRemaining(record -> {
                String username = record.get("username").asString();
                int count = record.get("followers").asInt();
                followersAndFollowees.put(username, new FollowersAndFollowees(count, 0));
            });

            followees.forEachRemaining(record -> {
                String username = record.get("username").asString();
                int count = record.get("followees").asInt();
                if (!followersAndFollowees.containsKey(username)) {
                    followersAndFollowees.put(username, new FollowersAndFollowees(0, count));
                } else {
                    FollowersAndFollowees ff = followersAndFollowees.get(username);
                    ff.setFollowees(count);
                }
            });

            for (String username : followersAndFollowees.keySet()) {
                Document update = new Document("$set", new Document("followers", followersAndFollowees.get(username).getFollowers())
                        .append("followees", followersAndFollowees.get(username).getFollowees()));

                mongoUsers.updateOne(new Document("_id", username), update);
            }
        } catch (Exception e) {
            logger.error("Error while loading followers and followees from Neo4j to MongoDB: " + e.getMessage());
        }

        logger.info("Followers and followees loaded from Neo4j to MongoDB.");
    }
}
