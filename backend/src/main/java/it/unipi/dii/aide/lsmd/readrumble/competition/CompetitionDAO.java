package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Updates;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

public class CompetitionDAO {
    public List<Document> retrieveAllCompetition()
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        List<Document> competitions = collection.find().into(new ArrayList<Document>());
        System.out.println(competitions);
        return competitions;
    }
    public List<Document> retrievePersonalCompetition(String _id)
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
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
            if(emb_users != null && emb_users.containsKey(_id))
            {
                results.add(com);
            }
            i = i+1;
        }
        System.out.println(results);
        return results;
    }
    public Document getCompetitionInformation(Document docx)
    {
        String Name = (String) docx.get("CompetitionTitle");
        String Username = (String) docx.get("Username");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        try(MongoCursor<Document> competition = collection.find(eq("Name",Name)).cursor())
        {
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
        catch(Exception e)
        {
            System.out.println("Exception Catched : " + e.getMessage());
            return null;
        }

    }
    public ResponseEntity<String> makeUserJoinCompetition(Document userDoc)
    {
        System.out.println(userDoc);
        String username = (String) userDoc.get("parametro1");
        String competitionTitle = (String) userDoc.get("parametro2");
        System.out.println(username);
        System.out.println(competitionTitle);
        Document userDocument = new Document(username, 0);
        String userField = "Users." + username;
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        Document competition = collection.find(eq("Name",competitionTitle)).first();

        if (competition != null) {
            //I get the embedded Document Users as a proper document
            Document usersObject = (Document) competition.get("Users");
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
}
