package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Updates;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

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
        //Document competitionFilter = new Document("Name", competitionTitle);
        Document competition = collection.find(eq("Name",competitionTitle)).first();

        if (competition != null) {
            //I get the embedded Document Users as a proper document
            Document usersObject = competition.get("Users", Document.class);
            System.out.println(usersObject);
            if (usersObject != null && usersObject.containsKey(username)) {
                //The user is already in the competition, this means that the user wants to leave the competition
                usersObject.remove(username);
                //In this operation I update all the embedded document Users
                collection.updateOne(eq("Name",competitionTitle), Updates.set("Users", usersObject));

                System.out.println("You Left The Competition !");
                return ResponseEntity.ok("You Left The Competition !");
            } else {
                //The user is not in the competition, so we will make the user join the competition
                usersObject.put(username, 0);
                collection.updateOne(eq("Name",competitionTitle), Updates.set("Users", usersObject));
                System.out.println(username +" You joined the " + competitionTitle + " Competititon !");
                return ResponseEntity.ok(username +" You joined the " + competitionTitle + " Competititon !");
            }
        } else {
            System.out.println("Competition Not Found");
            return ResponseEntity.ok("Competition Not Found");
        }
    }

    @GetMapping("/retrieve/all")
    public List<Document> retrieveALlCompetitions()
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        List<Document> competitions = collection.find().into(new ArrayList<Document>());
        System.out.println(competitions);
        return competitions;
    }
    @PostMapping("/retrieve/personal")
    public List<Document> retrievePersonalCompetitions(@RequestBody String Username)
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        List<Document> competitions = collection.find().into(new ArrayList<Document>());
        List<Document> results = new ArrayList<Document>();
        Integer i = 0;
        for(Document com : competitions)
        {
            if(i == 3)
            {
                break;
            }
            Document emb_users = (Document) com.get("Users");
            if(emb_users != null && emb_users.containsKey(Username))
            {
                results.add(com);
            }
            i = i+1;
        }
        System.out.println(results);
        return results;
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteCompetition(@RequestBody Document params)
    {
        String CompName = (String) params.get("CompName");
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        MongoCursor<Document> competitions = collection.find(eq("Name",CompName)).cursor();
        if(competitions.hasNext())
        {
            collection.deleteOne(eq("Name",CompName));
            return ResponseEntity.ok("Competition Deleted !");
        }
        else
        {
            return ResponseEntity.ok("Competition Does not exist !");
        }

    }
    @PostMapping("/add")
    public ResponseEntity<String> addCompetition(@RequestBody Document params)
    {
        String CompName = (String) params.get("CompName");
        String CompTag = (String) params.get("CompTag");
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        MongoCursor<Document> competitions = collection.find(eq("Name",CompName)).cursor();
        if(competitions.hasNext())
        {
            return ResponseEntity.ok("Competition Already Exists !");
        }
        else
        {
            Document new_add = new Document();
            Document users = new Document();
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String date_to_add = today.format(formatter);
            new_add.append("Name",CompName);
            new_add.append("Tag",CompTag);
            new_add.append("Start_Date",date_to_add);
            new_add.append("Users",users);
            collection.insertOne(new_add);
            return ResponseEntity.ok("Competition Created !");
        }

    }
    @PostMapping("/getcompinfo")
    public Document getCompetitionInfo(@RequestBody Document docx)
    {
        String Name = (String) docx.get("CompetitionTitle");
        String Username = (String) docx.get("Username");
        MongoCollection<Document> collection = MongoConfig.getCollection("competition");
        MongoCursor<Document> competition = collection.find(eq("Name",Name)).cursor();
        if(competition.hasNext())
        {
            Document doc = competition.next();
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
