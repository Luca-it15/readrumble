package it.unipi.dii.aide.lsmd.readrumble;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.UpdateOptions;
import it.unipi.dii.aide.lsmd.readrumble.bean.UserDTO;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.BsonDocument;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

@RestController
@RequestMapping("/api/competition")
@CrossOrigin(origins = "http://localhost:3000")
public class CompetitionController {



    @PostMapping("/user/quest")
    @ResponseBody
    public ResponseEntity<String> quest() {
        return ResponseEntity.ok("I'm Picking Up Good Vibrations");
    }
    @PostMapping("/join")
    public ResponseEntity<String>joinCompetition(@RequestBody String Username, String CompetitionTitle)
    {
        Document userDocument = new Document();
        userDocument.append("Username",Username);
        userDocument.append("ReadPageNumber",0);
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        collection.updateOne(eq("Name",CompetitionTitle),new Document("$set", userDocument),new UpdateOptions().upsert(true));
        return ResponseEntity.ok("Added to Competition");
    }
    @GetMapping("/retrieve")
    public List<Document> retrieveCompetitions()
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        List<Document> competitions = collection.find().into(new ArrayList<Document>());
        System.out.println(competitions);
        return competitions;
    }
}
