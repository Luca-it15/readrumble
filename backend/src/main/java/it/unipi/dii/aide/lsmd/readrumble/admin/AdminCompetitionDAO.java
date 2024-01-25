package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import redis.clients.jedis.Jedis;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class AdminCompetitionDAO {
    public ResponseEntity<String> adminAddCompetition(Document params) {
        //it only creates it in MongoDB
        String CompName = (String) params.get("name");
        String CompTag = (String) params.get("tag");
        String DATE_START = (String) params.get("start_date");
        String DATE_END = (String) params.get("end_date");
        System.out.println(params);
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        System.out.println(CompName + " " + CompTag);
        try(MongoCursor<Document> competitions = collection.find(eq("Name", CompName)).cursor())
        {
            if (competitions.hasNext()) {
                return ResponseEntity.ok("Competition Already Exists !");
            } else {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date start_date = sdf.parse(DATE_START);
                    Date end_date = sdf.parse(DATE_END);
                    ArrayList array = new ArrayList<>();
                    Document Doc = new Document();
                    Doc.append("name",CompName);
                    Doc.append("tag",CompTag);
                    Doc.append("start_date",start_date);
                    Doc.append("end_date",end_date);
                    Doc.append("rank",array);
                    collection.insertOne(Doc);
                } catch (ParseException e) {
                    e.printStackTrace();
                }

                return ResponseEntity.ok("Competition Created !");
            }
        }
        catch(Exception e)
        {
            System.out.println("Error catched: " + e.getMessage());
            return ResponseEntity.ok("Exception : " + e.getMessage());
        }


    }
    public ResponseEntity<String> adminDeleteCompetition(Document params) {
        Jedis jedis = RedisConfig.getSession();
        String CompName = (String) params.get("CompName");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        try {
            // Chiave composta
            String key = "competition:"+CompName+":*";
            System.out.println("the key is = " + key);
            jedis.del(key);
        }catch(Exception e)
        {
            System.out.println("Catched Exception: "+e.getMessage());
        }
        finally {
            RedisConfig.closeConnection();
        }
        try(MongoCursor<Document> competitions = collection.find(eq("name", CompName)).cursor())
        {
            if (competitions.hasNext()) {
                collection.deleteOne(eq("name", CompName));
                return ResponseEntity.ok("Competition Deleted !");
            } else {
                return ResponseEntity.ok("Competition Does not exist !");
            }
        }
        catch(Exception e)
        {
            System.out.println("Error catched: " + e.getMessage());
            return ResponseEntity.ok("Exception : " + e.getMessage());
        }


    }

    public Map<String, Integer> getPagesByTag() {
        // Get the collection of competitions
        MongoCollection<Document> CompetitionsCollection = MongoConfig.getCollection("Competitions");

        // Get the competitions with start date in the last six months
        LocalDate today = LocalDate.now();
        LocalDate sixMonthsAgo = today.minusMonths(6);

        // Get the competitions with start date in the last six months, get the average pages_read of the rank, then group by tag
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

    public Map<String, Map<String, Integer>> getPagesByMonthAndTag() {
        // Get the collection of competitions
        MongoCollection<Document> CompetitionsCollection = MongoConfig.getCollection("Competitions");

        // Get the competitions with start date in the last 12 months
        LocalDate today = LocalDate.now();
        LocalDate sixMonthsAgo = today.minusMonths(12);

        // Get the competitions with start date in the last 12 months, get the average pages_read of the rank, then group by tag and by month of the start date
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
