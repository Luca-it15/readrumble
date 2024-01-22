package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.*;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
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
    public Document goCompetitionInformation(Document docx)
    {
        String competitionTitle = (String) docx.get("CompetitionTitle");
        String username = (String) docx.get("Username");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        ArrayList<Document> result = collection.find(eq("name",competitionTitle)).into(new ArrayList<>());
        Document doc = result.getFirst();
        System.out.println(doc);
        ArrayList<Document> list = (ArrayList<Document>) doc.get("Users");
        if(list != null)
        {
            Iterator<Document> user = list.iterator();
            while(user.hasNext())
            {
                Document UtilUser = user.next();
                String userUtilString = (String) UtilUser.get("username");
                if(userUtilString != null)
                {
                    if(userUtilString.equals(username))
                    {
                        doc.append("isIn",true);
                        return doc;
                    }
                }
            }
            doc.append("isIn",false);
            return doc;
        }
        else
        {
            doc.append("isIn",false);
            return doc;
        }
        /*try(MongoCursor<Document> competition = collection.find(eq("name",Name)).cursor())
        {
            if(competition.hasNext())
            {
                Document doc = competition.next();
                Document users_doc = (Document) doc.get("Users");
                System.out.println(users_doc);


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
        }*/
    }
    public ResponseEntity<String> makeUserJoinCompetition(Document userDoc)
    {
        System.out.println(userDoc);
        String username = (String) userDoc.get("parametro1");
        String competitionTitle = (String) userDoc.get("parametro2");
        System.out.println(username);
        System.out.println(competitionTitle);
        Document userDocument = new Document();
        userDocument.append("username",username);
        userDocument.append("pages_read",0);
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        System.out.println("superato");
        Document competition = collection.find(eq("name",competitionTitle)).first();
        System.out.println("superato2");
        if (competition != null) {
            //I get the embedded Document Users as a proper document
            ArrayList<Document> usersObject = (ArrayList<Document>) competition.get("Users");
            Iterator<Document> user = usersObject.iterator();
            while(user.hasNext())
            {
                Document UtilUser = user.next();
                String userUtilString = (String) UtilUser.get("username");
                if(userUtilString != null)
                {
                    if(userUtilString.equals(username))
                    {
                        System.out.println("c'è " + username);
                        Bson filter = Filters.eq("name", competitionTitle);
                        Document pullOperation = new Document("$pull", new Document("Users", new Document("username", username)));
                        UpdateResult updateResult = collection.updateOne(filter,pullOperation);
                        System.out.println(updateResult);
                        System.out.println("You Left The Competition !");
                        return ResponseEntity.ok("You Left The Competition !");
                    }
                }

            }
            System.out.println("non c'è " + username);
            collection.updateOne(eq("name",competitionTitle), Updates.push("Users", userDocument));
            System.out.println(username +" You joined the " + competitionTitle + " Competititon !");
            return ResponseEntity.ok(username +" You joined the " + competitionTitle + " Competititon !");
            /*
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
            }*/
        } else {
            System.out.println("Competition Not Found");
            return ResponseEntity.ok("Competition Not Found");
        }
    }
}
