package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.book.Book;
import org.bson.conversions.Bson;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class AdminBookDAO {
    public ResponseEntity<String> removeBook(long id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Books");
        Document query = new Document("_id", id);
        Document target = collection.find(query).first();
        if(target != null) {
            collection.deleteOne(target);
            return ResponseEntity.ok("book remove successfull");
        } else
            return ResponseEntity.ok("failed to remove the book");
    }

    public ResponseEntity<String> addBook(Book book) {

        MongoCollection<Document> collection = MongoConfig.getCollection("Books");

        Instant instant = Instant.now();
        long timestamp = instant.toEpochMilli();
          Document document = new Document("_id", timestamp)
                    .append("isbn", book.getIsbn())
                    .append("description", book.getDescription())
                    .append("link", book.getLink())
                    .append("authors", book.getAuthors())
                    .append("publisher", book.getPublisher())
                    .append("num_pages", book.getNum_pages())
                    .append("publication_year", book.getPublication_year())
                    .append("url", book.getUrl())
                    .append("image_url", book.getImage_url())
                    .append("title", book.getTitle())
                    .append("tags", book.getTags());
            collection.insertOne(document);

        return ResponseEntity.ok("book add successfull");
        }

    public ResponseEntity<String> updateBook(Document changes)
    {
        int new_field_int = 0;
        String new_field_String = null;
        List<String> new_field_list = new ArrayList<>();
        int index = 0;
        String type_of_change_request = (String) changes.get("type_of_change_request");
        if(type_of_change_request.equals("num_pages") || type_of_change_request.equals("publication_year")) {
            new_field_int = changes.getInteger("new_field");
            index = 0;
        } else if(type_of_change_request.equals("tags") || type_of_change_request.equals("authors")) {
          new_field_list =  (List<String>) changes.get("type_of_change_request");
          index = 1;

        } else
            new_field_String = changes.getString("type_of_change_request");
        long id_to_use = Long.parseLong(changes.getString("id_to_use"));
        MongoCollection<Document> collection = MongoConfig.getCollection("Books");
        Document book = collection.find(eq("_id", id_to_use)).first();
        String result = null;
         try {
             if(book != null) {
                 switch (index) {
                     case 0:
                         collection.updateOne(eq("_id", id_to_use), set(type_of_change_request, new_field_int));
                         result = (String) type_of_change_request + " Changed in " +  new_field_int;
                         break;
                     case 1:
                         collection.updateOne(eq("_id", id_to_use), set(type_of_change_request, new_field_list));
                          result = (String) type_of_change_request + " Changed in " +  new_field_list;
                         break;
                     default:
                         collection.updateOne(eq("_id", id_to_use), set(type_of_change_request, new_field_String));
                         result = (String) type_of_change_request + " Changed in " +  new_field_String;
                 }
                 return ResponseEntity.ok(result);
             }
            else
            {
                return ResponseEntity.ok("NOT FOUND");
            }
        }
        catch(Exception e)
        {
            System.out.println("Exception error catched: " + e.getMessage());
            return ResponseEntity.ok("EXCEPTION IN SERVER");
        }
        finally {
            MongoConfig.closeConnection();
        }


    }
}
