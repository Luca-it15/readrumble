package it.unipi.dii.aide.lsmd.readrumble.search;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.book.LightBookDTO;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.post.PostDTO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDTO;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class SearchDao {

    public List<PostDTO> findByStringPosts(String searchString) {
        List<PostDTO> target = new ArrayList<>();
        MongoCollection<Document> collection = MongoConfig.getCollection("Posts");

        String decodedString = URLDecoder.decode(searchString, StandardCharsets.UTF_8);
        String cleanedString = decodedString.substring(0, decodedString.length() - 1);


        Document query1 = new Document("review_text", new Document("$regex", cleanedString));
        List<Document> results1 = collection.find(query1).limit(10).into(new ArrayList<>());
        //retrieve the first results of document that match the filter
        for (Document doc : results1) {
            PostDTO post = new PostDTO(
                    doc.getLong("_id"),
                    doc.getInteger("book_id"),
                    doc.getInteger("rating"),
                    doc.getDate("date_added"),
                    doc.getString("book_title"),
                    doc.getString("username")
            );
            target.add(post);
        }

        return target;
    }

    public List<UserDTO> findByStringUsers(String searchString) {
        List<UserDTO> target = new ArrayList<>();
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        String decodedString = URLDecoder.decode(searchString, StandardCharsets.UTF_8);
        String cleanedString = decodedString.substring(0, decodedString.length() - 1);

        Document query = new Document("_id", new Document("$regex", cleanedString));
        List<Document> results = collection.find(query).limit(10).into(new ArrayList<>());
        //retrieve the first results of document that match the filter
        for (Document doc : results) {
            UserDTO user = new UserDTO(
                    doc.getString("_id"),
                    doc.getString("name"),
                    doc.getString("surname")
            );
            target.add(user);
        }

        return target;
    }

    public List<LightBookDTO> findByStringBooks(String searchString) {
        List<LightBookDTO> target = new ArrayList<>();
        MongoCollection<Document> collection = MongoConfig.getCollection("Books");

        String decodedString = URLDecoder.decode(searchString, StandardCharsets.UTF_8);
        String cleanedString = decodedString.substring(0, decodedString.length() - 1);

        Document query = new Document("title", new Document("$regex", cleanedString));
        List<Document> results = collection.find(query).limit(10).into(new ArrayList<>());
        //retrieve the first results of document that match the filter
        for (Document doc : results) {
            LightBookDTO lightBookDTO = new LightBookDTO(
                    doc.getLong("_id"),
                    doc.getString("title")
            );
            target.add(lightBookDTO);
        }
        return target;
    }


}
