package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.*;
import com.mongodb.client.result.DeleteResult;
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
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        List<Document> competitions = collection.find(Filters.gte("end_date",date_of_today))
                .sort(Sorts.descending("end_date"))
                .into(new ArrayList<>());
        System.out.println(competitions);
        return competitions;
    }
    public List<Document> getPopularCompetitions()
    {
        Bson dateFilter = Filters.gt("end_date", LocalDate.now());
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        AggregateIterable<Document> aggregation = collection.aggregate(Arrays.asList(
            Aggregates.match(dateFilter),
            Aggregates.project(
                Projections.fields(
                    Projections.include("Name", "Tag", "Users"),
                    Projections.computed("UsersCount",
                    new Document("$size", new Document("$objectToArray", "$Users")))
                )
            ),
            Aggregates.sort(Sorts.descending("UsersCount")),
            Aggregates.limit(10)
        ));
        List<Document> competitions = new ArrayList<Document>();
        // Iterare sui risultati dell'aggregazione
        for (Document document : aggregation) {
            String name = document.getString("Name");
            String tag = document.getString("Tag");
            int usersCount = document.getInteger("UsersCount");
            competitions.add(document);
            // Fai qualcosa con i dati ottenuti
            System.out.println("Name: " + name + ", Tag: " + tag + ", UsersCount: " + usersCount);
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
    public ResponseEntity<String> userJoinsCompetition(Document userDoc)
    {
        //nel qual caso io decida di lasciare la competizione il rank viene aggiornato comunque
        //devo però fare in modo di lanciare la query di aggiornamento del documento competition alla scadenza della competizione
        Jedis jedis = RedisConfig.getSession();
        String username = (String) userDoc.get("parametro1");
        String competitionTitle = (String) userDoc.get("parametro2");
        try {
            // Chiave composta
            String key = competitionTitle + ":" + username;
            System.out.println("the key is = " + key);
            if(jedis.get(key)==null)
            {
                //User is not in the competition so we make him join
                jedis.set(key, "0");
                System.out.println(jedis.get(key));
                return ResponseEntity.ok(username +" You joined the " + competitionTitle + " Competititon !");
            }
            else
            {
                jedis.del(key);
                System.out.println(jedis.get(key));
                return ResponseEntity.ok("You Left The Competition !");
            }
        } finally {
            RedisConfig.closeConnection();
        }
    }
}
