package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.*;
import com.mongodb.client.result.DeleteResult;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import org.neo4j.driver.Session;
import org.neo4j.driver.Values;
import redis.clients.jedis.Jedis;
import com.mongodb.client.result.UpdateResult;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.http.ResponseEntity;
import com.mongodb.client.AggregateIterable;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;

import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class CompetitionDAO {

    public List<CompetitionDTO> getAllCompetition() {

        LocalDate date_of_today = LocalDate.now();
        LocalDate date_5_days_before = date_of_today.minusDays(5);
        Bson end_dateFilter = Filters.gte("end_date", date_5_days_before);
        Bson start_dateFilter = Filters.lte("start_date", date_of_today);
        Bson dateFilter = Filters.and(start_dateFilter, end_dateFilter);
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        ArrayList<Document> competitions = collection.find(dateFilter).sort(Sorts.descending("end_date")).into(new ArrayList<>());
        List<CompetitionDTO> competitionDTOS = new ArrayList<>();
        for(Document competition : competitions)
        {
            CompetitionDTO comp = new CompetitionDTO(competition);
            System.out.println(comp);
            competitionDTOS.add(comp);
        }

        return competitionDTOS;
    }

    public List<Document> getPopularCompetitions() {
        Bson end_dateFilter = Filters.gt("end_date", LocalDate.now());
        Bson start_dateFilter = Filters.lte("start_date", LocalDate.now());
        Bson dateFilter = Filters.and(start_dateFilter, end_dateFilter);
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        AggregateIterable<Document> aggregation = collection.aggregate(Arrays.asList(
                Aggregates.match(dateFilter),
                Aggregates.project(
                        Projections.fields(
                                Projections.include("name", "tag", "rank"),
                                Projections.computed("Total_Pages", new Document("$sum", "$rank.tot_pages"))
                        )
                ),
                Aggregates.sort(Sorts.descending("Total_Pages")),
                Aggregates.limit(10)
        ));
        List<Document> competitions = new ArrayList<Document>();
        for (Document document : aggregation) {
            String name = document.getString("name");
            String tag = document.getString("tag");
            int Total_Pages = document.getInteger("Total_Pages");
            competitions.add(document);
        }
        return competitions;
    }

    public List<Document> getPersonalCompetition(String _id) {
        try {
            //Jedis jedis = RedisConfig.getSession();
            JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
            List<String> matchingKeys = KeysTwo(jedis, "competition:*:*:" + _id);
            List<Document> result = new ArrayList<>();
            for (String key : matchingKeys) {
                System.out.println(key);
                String value = jedis.get(key);
                Document doc = new Document();
                doc.append("CompName", key);
                doc.append("Pages_read", value);
                result.add(doc);
            }

            return result;
        } catch (Exception e) {
            System.out.println("Catched error in matchingKeys: " + e.getMessage());
        }

        List<Document> result = new ArrayList<Document>();
        Document t = new Document();
        t.append("empty", "empty");
        result.add(t);
        return result;
    }

    public CompetitionDTO goCompetitionInformation(Document docx) {
        String competitionTitle = (String) docx.get("CompetitionTitle");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        ArrayList<Document> result = collection.find(eq("name", competitionTitle)).into(new ArrayList<>());
        CompetitionDTO competition = new CompetitionDTO(result.getFirst());
        System.out.println(competition);
        return competition;
    }

    public ResponseEntity<String> userJoinsOrLeavesCompetition(Document userDoc) {
        //Jedis jedis = RedisConfig.getSession();
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        String username = (String) userDoc.get("username");
        String competitionTitle = (String) userDoc.get("competitionTitle");
        String competitionTag = (String) userDoc.get("competitionTag");
        try {
            String key = "competition:" + competitionTitle + ":" + competitionTag + ":" + username;
            System.out.println("the key is = " + key);
            if (jedis.get(key) == null) {
                //If there is not the key-value couple for that user and that competition
                //then it means that the user wants to join the competition
                //so we create it's key-value couple and put into the redis database
                jedis.set(key, "0");
                System.out.println(jedis.get(key));
                return ResponseEntity.ok(username + " You joined the " + competitionTitle + " Competititon !");
            } else {
                //if there is the key-value couple in the database then it means that
                //the user wants to leave the competition so we delete the key-value couple
                //from the database
                jedis.del(key);
                System.out.println(jedis.get(key));
                return ResponseEntity.ok("You Left The Competition !");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Exception : " + e.getMessage());
        }
    }
}
