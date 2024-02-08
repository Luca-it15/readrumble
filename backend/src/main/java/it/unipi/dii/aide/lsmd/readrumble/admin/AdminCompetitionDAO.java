package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionDTO;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import redis.clients.jedis.*;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import redis.clients.jedis.Jedis;
import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class AdminCompetitionDAO {
    static List<Document> inMemoryCompetitions = new ArrayList<>();
    static List<String> toDeleteCompetitions = new ArrayList<>();
    public void saveInMemoryCompetitions() {
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");

        if (!inMemoryCompetitions.isEmpty()) {
            collection.insertMany(inMemoryCompetitions);

            inMemoryCompetitions.clear();
        }
    }
    public void saveInMemoryCompetitionsToDelete(String competition_name) {
        toDeleteCompetitions.add(competition_name);
    }

    public void eliminateCompetitions() {
        if (!toDeleteCompetitions.isEmpty()) {
            for(String comp : toDeleteCompetitions)
            {
                adminDeleteCompetition(comp);
            }
            toDeleteCompetitions.clear();
        }
    }

    public ResponseEntity<String> adminAddCompetition(Document comp){
        CompetitionDTO competition = new CompetitionDTO(comp);
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        try (MongoCursor<Document> competitions = collection.find(eq("Name", competition.getName())).cursor()) {
            if (competitions.hasNext()) {
                return ResponseEntity.ok("Competition Already Exists !");
            } else {
                inMemoryCompetitions.add(competition.toDocument());
                return ResponseEntity.ok("Competition Created !");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Exception : " + e.getMessage());
        }
    }

    public void adminDeleteCompetition(String competition_name) {

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        //competition:competition_name:tag:username->10
        try {
            List<String> keys = KeysTwo(jedis,"competition:" + competition_name + ":*");
            for(String key : keys)
            {
                jedis.del(key);
            }
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
        }

        try (MongoCursor<Document> competitions = collection.find(eq("name", competition_name)).cursor()) {
            if (competitions.hasNext()) {
                collection.deleteOne(eq("name", competition_name));

                System.out.println("Competition deleted!");
            } else {
                System.out.println("Competition does not exist!");
            }
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }

    /**
     * This method is used to retrieve the list of tags and average points of the last six months, based on the first 10 users in ranking
     *
     * @return the list of tags and average points of the last 12 months
     */
    public Map<String, Integer> getPagesByTag() {
        MongoCollection<Document> CompetitionsCollection = MongoConfig.getCollection("Competitions");

        LocalDate today = LocalDate.now();
        LocalDate sixMonthsAgo = today.minusMonths(6);

        List<Document> result = CompetitionsCollection.aggregate(List.of(
                new Document("$match", new Document("start_date", new Document("$gte", Date.from(sixMonthsAgo.atStartOfDay(ZoneId.systemDefault()).toInstant())))),
                new Document("$unwind", "$rank"),
                new Document("$group", new Document("_id", "$tag").append("avg_pages_read", new Document("$avg", "$rank.tot_pages"))),
                new Document("$project", new Document("tag", "$_id").append("avg_pages_read", new Document("$toInt", "$avg_pages_read"))),
                new Document("$sort", new Document("avg_pages_read", 1))
        )).into(new ArrayList<>());

        Map<String, Integer> pagesByTag = new HashMap<>();

        for (Document doc : result) {
            String tag = doc.getString("tag");
            int avgPagesRead = doc.getInteger("avg_pages_read");
            pagesByTag.put(tag, avgPagesRead);
        }

        return pagesByTag;
    }

    /**
     * This method is used to retrieve the list of months and average points by tag of the last 12 months, based on the first 10 users in the rankings
     *
     * @return the list of tags and average points of the last six months
     */
    public Map<String, Map<String, Integer>> getPagesByMonthAndTag() {
        MongoCollection<Document> CompetitionsCollection = MongoConfig.getCollection("Competitions");

        LocalDate today = LocalDate.now();
        LocalDate sixMonthsAgo = today.minusMonths(12);

        List<Document> result = CompetitionsCollection.aggregate(List.of(
                new Document("$match", new Document("start_date", new Document("$gte", Date.from(sixMonthsAgo.atStartOfDay(ZoneId.systemDefault()).toInstant())))),
                new Document("$unwind", "$rank"),
                new Document("$group", new Document("_id", new Document("tag", "$tag").append("month", new Document("$month", "$start_date"))).append("avg_pages_read", new Document("$avg", "$rank.tot_pages"))),
                new Document("$project", new Document("month", "$_id.month").append("tag", "$_id.tag").append("avg_pages_read", new Document("$toInt", "$avg_pages_read")))
        )).into(new ArrayList<>());

        Map<String, Map<String, Integer>> pagesByMonthAndTag = new HashMap<>();

        for (Document doc : result) {
            String tag = doc.getString("tag");
            int month = doc.getInteger("month");
            int avgPagesRead = doc.getInteger("avg_pages_read");

            if (!pagesByMonthAndTag.containsKey(String.valueOf(month))) {
                pagesByMonthAndTag.put(String.valueOf(month), new HashMap<>());
            }

            pagesByMonthAndTag.get(String.valueOf(month)).put(tag, avgPagesRead);
        }

        return pagesByMonthAndTag;
    }
}
