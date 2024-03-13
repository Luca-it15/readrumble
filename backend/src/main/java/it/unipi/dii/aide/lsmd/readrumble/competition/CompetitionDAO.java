package it.unipi.dii.aide.lsmd.readrumble.competition;

import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;

import static com.mongodb.client.model.Filters.eq;

import org.bson.Document;
import org.bson.conversions.Bson;

import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;

import redis.clients.jedis.JedisCluster;

import java.time.LocalDate;
import java.util.*;

public class CompetitionDAO {
    public List<CompetitionDTO> getAllCompetition() {
        LocalDate date_of_today = LocalDate.now();
        LocalDate date_5_days_before = date_of_today.minusDays(5);

        Bson end_dateFilter = Filters.gte("end_date", date_5_days_before);
        Bson start_dateFilter = Filters.lte("start_date", date_of_today);
        Bson dateFilter = Filters.and(start_dateFilter, end_dateFilter);

        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");

        ArrayList<Document> competitions = collection.find(dateFilter)
                .sort(Sorts.descending("end_date"))
                .into(new ArrayList<>());

        List<CompetitionDTO> competitionDTOS = new ArrayList<>();

        for (Document competition : competitions) {
            CompetitionDTO comp = new CompetitionDTO(competition);
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
                Aggregates.sort(Sorts.descending("Total_Pages"))
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

    public List<Map<String, String>> getJoinedBy(String id) {
        Logger logger = org.slf4j.LoggerFactory.getLogger(CompetitionController.class);

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        String pattern = "competition:*:*:" + id;

        logger.info("Fetching competitions for user: " + id);

        List<String> keys = KeysTwo(jedis, pattern);
        if (keys.isEmpty()) {
            logger.info("Keys not found");
            return new ArrayList<>();
        }

        List<Map<String, String>> competitions = new ArrayList<>();

        for (String key : keys) {
            String competition = key.split(":")[1]; // Competition name
            String tag = key.split(":")[2]; // Competition tag

            Integer pages = Integer.parseInt(String.valueOf(jedis.get(key)));

            Map<String, String> competitionMap = new HashMap<>();
            competitionMap.put("name", competition);
            competitionMap.put("pages", String.valueOf(pages));
            competitionMap.put("tag", tag);
            competitions.add(competitionMap);
        }

        return competitions;
    }

    public CompetitionDTO goCompetitionInformation(Document docx) {
        String competitionTitle = (String) docx.get("CompetitionTitle");

        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");

        ArrayList<Document> result = collection.find(eq("name", competitionTitle)).into(new ArrayList<>());

        return new CompetitionDTO(result.getFirst());
    }

    public ResponseEntity<String> userJoinsOrLeavesCompetition(Document userDoc) {
        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();

        String username = (String) userDoc.get("username");
        String competitionTitle = (String) userDoc.get("competitionTitle");
        String competitionTag = (String) userDoc.get("competitionTag");

        try {
            String key = "competition:" + competitionTitle + ":" + competitionTag + ":" + username;

            if (jedis.get(key) == null) {
                //If there is not the key-value couple for that user and that competition
                //then it means that the user wants to join the competition
                //so we create it's key-value couple and put into the redis database
                jedis.set(key, "0");

                return ResponseEntity.ok(username + " You joined the " + competitionTitle + " competititon !");
            } else {
                //if there is the key-value couple in the database then it means that
                //the user wants to leave the competition so we delete the key-value couple
                //from the database
                jedis.del(key);

                return ResponseEntity.ok("You left the competition");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Exception : " + e.getMessage());
        }
    }
}
