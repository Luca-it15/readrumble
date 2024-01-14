package it.unipi.dii.aide.lsmd.readrumble.user;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.review.ReviewDTO;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    public List<UserDTO> allUser() {
        List<UserDTO> users = new ArrayList<>();

        MongoCollection<Document> collection = MongoConfig.getCollection("User");

        // Ottieni le prime 10 recensioni
        for (Document doc : collection.find().limit(10)) {

            UserDTO user = new UserDTO(
                    doc.getString("_id"),
                    doc.getString("name"),
                    doc.getString("surname")
            );
            users.add(user);
        }

        // Chiudi il client MongoDB
        return users;
    }
}
