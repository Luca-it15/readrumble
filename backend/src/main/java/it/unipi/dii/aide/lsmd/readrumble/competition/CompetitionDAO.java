package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Updates;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;

import java.util.*;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class CompetitionDAO {
    public static Map<String, Object> sortDocumentByValues(Map<String, Object> document) {
        // Trasforma il documento in una lista di coppie chiave-valore
        List<Map.Entry<String, Object>> entryList = new ArrayList<>(document.entrySet());

        // Ordina la lista in base ai valori in ordine decrescente
        entryList.sort(Comparator.comparing(entry -> (Integer) entry.getValue(), Comparator.reverseOrder()));

        // Crea un nuovo documento con le coppie chiave-valore ordinate
        Map<String, Object> sortedDocument = entryList.stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        return sortedDocument;
    }
    public List<Document> getAllCompetition()
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        List<Document> competitions = collection.find().into(new ArrayList<Document>());
        System.out.println(competitions);
        return competitions;
    }
    public List<Document> getPopularCompetitions()
    {
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        AggregateIterable<Document> aggregation = collection.aggregate(Arrays.asList(
            Aggregates.project(
                Projections.fields(
                    Projections.include("Name", "Tag", "Users"),
                    Projections.computed("UsersCount",
                    new Document("$size", new Document("$objectToArray", "$Users")))
                )
            ),
            Aggregates.sort(Sorts.descending("UsersCount"))
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
        String Name = (String) docx.get("CompetitionTitle");
        String Username = (String) docx.get("Username");
        MongoCollection<Document> collection = MongoConfig.getCollection("Competitions");
        try(MongoCursor<Document> competition = collection.find(eq("Name",Name)).cursor())
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
