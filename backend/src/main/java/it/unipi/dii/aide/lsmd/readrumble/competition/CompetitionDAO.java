package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.*;
import com.mongodb.client.result.DeleteResult;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
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
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class CompetitionDAO {

    public List<Document> getAllCompetition()
    {

        LocalDate date_of_today = LocalDate.now();
        Bson end_dateFilter = Filters.gte("end_date", LocalDate.now());
        Bson start_dateFilter = Filters.lte("start_date", LocalDate.now());
        Bson dateFilter = Filters.and(start_dateFilter,end_dateFilter);
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        List<Document> competitions = collection.find(dateFilter)
                .sort(Sorts.descending("end_date"))
                .into(new ArrayList<>());
        System.out.println(competitions);
        return competitions;
    }
    public List<Document> getPopularCompetitions()
    {
        Bson end_dateFilter = Filters.gt("end_date", LocalDate.now());
        Bson start_dateFilter = Filters.lte("start_date", LocalDate.now());
        Bson dateFilter = Filters.and(start_dateFilter,end_dateFilter);
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
        // Iterare sui risultati dell'aggregazione
        for (Document document : aggregation) {
            String name = document.getString("name");
            String tag = document.getString("tag");

            int Total_Pages = document.getInteger("Total_Pages");
            competitions.add(document);
            // Fai qualcosa con i dati ottenuti
            System.out.println("name: " + name + ", tag: " + tag + ", Total_Pages: " + Total_Pages);
        }
        return competitions;
    }
    public List<Document> getPersonalCompetition(String _id)
    {
        System.out.println("Siamo in getPersonalCompetition !!!!!! " + _id);
        try {
            Jedis jedis = RedisConfig.getSession();
            System.out.println("dentro ese" + _id);
            try{
                Set<String> matchingKeys = jedis.keys("*:"+_id);
                List<Document> result = new ArrayList<Document>();
                for (String key : matchingKeys) {
                    try {
                        String value = jedis.get(key);
                        System.out.println("Key: " + key + ", Value: " + value);
                        Document doc = new Document();
                        doc.append("CompName", key);
                        doc.append("Pages_read", value);
                        result.add(doc);
                    } catch(Exception e)
                    {
                        System.out.println("Catched error in appending documents and keys: " + e.getMessage());
                    }
                }
                jedis.close();
                return result;
            }
            catch(Exception e)
            {
                System.out.println("Catched error in matchingKeys: " + e.getMessage());
            }
        }
        catch(Exception e)
        {
            System.out.println("Catched error in getSession: " + e.getMessage());
        }
        List<Document> result = new ArrayList<Document>();
        Document t = new Document();
        t.append("CIAO","CIAO");
        result.add(t);
        return result;
    }
    public Document goCompetitionInformation(Document docx)
    {
        String competitionTitle = (String) docx.get("CompetitionTitle");
        String username = (String) docx.get("Username");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        ArrayList<Document> result = collection.find(eq("name",competitionTitle)).into(new ArrayList<>());
        Document doc = result.getFirst();
        System.out.println(doc);
        return doc;
    }
    public ResponseEntity<String> userJoinsOrLeavesCompetition(Document userDoc)
    {
        Jedis jedis = RedisConfig.getSession();
        String username = (String) userDoc.get("username");
        String competitionTitle = (String) userDoc.get("competitionTitle");
        String competitionTag = (String) userDoc.get("competitionTag");
        try {
            String key = "competition:"+competitionTitle + ":" + competitionTag + ":" + username;
            System.out.println("the key is = " + key);
            if(jedis.get(key)==null)
            {
                //If there is not the key-value couple for that user and that competition
                //then it means that the user wants to join the competition
                //so we create it's key-value couple and put into the redis database
                jedis.set(key, "0");
                System.out.println(jedis.get(key));
                return ResponseEntity.ok(username +" You joined the " + competitionTitle + " Competititon !");
            }
            else
            {
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
