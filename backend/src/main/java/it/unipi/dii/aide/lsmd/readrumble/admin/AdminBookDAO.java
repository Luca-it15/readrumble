package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

public class AdminBookDAO {
    public String removeBook(int id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Books");
        Document query = new Document("_id", id);
        Document target = collection.find(query).first();
        if(target != null) {
            collection.deleteOne(target);
            return "book successful remove";
        } else
            return "failed to remove the book";
    }
}
