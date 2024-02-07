package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Updates;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class AdminUserDAO {
    public List<Document> adminGetBannedUser() {
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        return collection.find(eq("isBanned", 1)).into(new ArrayList<>());
    }

    public AdminUserDTO AdminSearchUser(String _id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        try (MongoCursor<Document> doc = collection.find(eq("_id", _id)).cursor()) {
            if (doc.hasNext()) {
                AdminUserDTO user = new AdminUserDTO(doc.next());
                return user;
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<String> goAdminBan(String _id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        try (MongoCursor<Document> doc = collection.find(eq("_id", _id)).cursor()) {
            if (doc.hasNext()) {
                AdminUserDTO user = new AdminUserDTO(doc.next());
                if (user.getIsBanned()) {
                    return ResponseEntity.ok("User is already Banned");
                } else {
                    collection.updateOne(eq("_id", _id), Updates.set("isBanned", 1));
                    return ResponseEntity.ok(_id + " user is now Banned");
                }
            } else {
                return ResponseEntity.ok("No User with such username");
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<String> goAdminUnban(String _id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
        try (MongoCursor<Document> doc = collection.find(eq("_id", _id)).cursor()) {
            if (doc.hasNext()) {
                AdminUserDTO user = new AdminUserDTO(doc.next());
                if (!user.getIsBanned()) {
                    return ResponseEntity.ok("User is not banned");
                } else {
                    collection.updateOne(eq("_id", _id), Updates.unset("isBanned"));
                    return ResponseEntity.ok(_id + " user is now Unbanned");
                }
            } else {
                return ResponseEntity.ok("No User with such username");
            }
        } catch (Exception e) {
            return null;
        }
    }
}
