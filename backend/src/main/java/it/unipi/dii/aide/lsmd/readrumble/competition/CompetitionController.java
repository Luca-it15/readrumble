package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.model.Updates;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.mongodb.client.model.Aggregates.set;
import static com.mongodb.client.model.Filters.*;

@RestController
@RequestMapping("/api/competition")
@CrossOrigin(origins = "http://localhost:3000")
public class CompetitionController {

    @PostMapping("/join")
    public ResponseEntity<String> joinCompetition(@RequestBody Document userDoc) {
        System.out.println(userDoc);
        String username = (String) userDoc.get("parametro1");
        String competitionTitle = (String) userDoc.get("parametro2");
        System.out.println(username);
        System.out.println(competitionTitle);
        Document userDocument = new Document(username, 0);
        String userField = "Users." + username;
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        Document competitionFilter = new Document("Name", competitionTitle);
        Document competition = collection.find(competitionFilter).first();

        if (competition != null) {
            Document usersObject = competition.get("Users", Document.class);

            if (usersObject != null && usersObject.containsKey(username)) {
                //The user is already in the competition, this means that the user wants to leave the competition
                usersObject.remove(username);
                collection.updateOne(competitionFilter, new Document("$set", new Document("Users", usersObject)));

                System.out.println("You Left The Competition !");
                return ResponseEntity.ok("You Left The Competition !");
            } else {
                //The user is not in the competition, so we will make the user join the competition
                usersObject.put(username, 0);
                collection.updateOne(competitionFilter, new Document("$set", new Document("Users", usersObject)));
                System.out.println(username +" You joined the " + competitionTitle + " Competititon !");
                return ResponseEntity.ok(username +" You joined the " + competitionTitle + " Competititon !");
            }
        } else {
            System.out.println("Competition Not Found");
            return ResponseEntity.ok("Competition Not Found");
        }
    }

    @GetMapping("/retrieve")
    public List<Document> retrieveCompetitions()
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        List<Document> competitions = collection.find().into(new ArrayList<Document>());
        System.out.println(competitions);
        return competitions;
    }
    @PostMapping("/getcompinfo")
    public Document getCompetitionInfo(@RequestBody Document docx)
    {
        String Name = (String) docx.get("CompetitionTitle");
        String Username = (String) docx.get("Username");
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        MongoCursor competition = collection.find(eq("Name",Name)).cursor();
        if(competition.hasNext())
        {
            Document doc = (Document) competition.next();
            Document users_doc = (Document) doc.get("Users");
            if(users_doc.get(Username) == null)
            {
                doc.append("isIn","NO");
            }
            else
            {
                doc.append("isIn","YES");
            }
            return doc;
        }
        else
        {
            System.out.println("No such Competition with name: " + Name);
            return null;
        }

    }
}
