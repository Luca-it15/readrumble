package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static com.mongodb.client.model.Filters.eq;

public class AdminCompetitionDAO {
    public ResponseEntity<String> adminAddCompetition(Document params) {
        String CompName = (String) params.get("CompName");
        String CompTag = (String) params.get("CompTag");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        System.out.println(CompName + " " + CompTag);
        try(MongoCursor<Document> competitions = collection.find(eq("Name", CompName)).cursor())
        {
            if (competitions.hasNext()) {
                return ResponseEntity.ok("Competition Already Exists !");
            } else {
                Document new_add = new Document();
                Document users = new Document();
                LocalDate today = LocalDate.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                String date_to_add = today.format(formatter);
                new_add.append("Name", CompName);
                new_add.append("Tag", CompTag);
                new_add.append("Start_Date", date_to_add);
                new_add.append("Users", users);
                collection.insertOne(new_add);
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
        String CompName = (String) params.get("CompName");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
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
