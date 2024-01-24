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
import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class AdminCompetitionDAO {
    public ResponseEntity<String> adminAddCompetition(Document params) {
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
            String key = CompName+":*";
            System.out.println("the key is = " + key);
            jedis.del(key);
        } finally {
            RedisConfig.closeConnection();
        }
        try(MongoCursor<Document> competitions = collection.find(eq("Name", CompName)).cursor())
        {
            if (competitions.hasNext()) {
                collection.deleteOne(eq("Name", CompName));
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
}
