package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.review.ReviewDTO;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

@RestController
@RequestMapping("/api/admin/user")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUserController {

    private AdminUserDAO adminUserDAO;
    public AdminUserController() {
        adminUserDAO = new AdminUserDAO();
    }

    @PostMapping("/unban")
    public ResponseEntity<String> goUnban(@RequestBody String _id)
    {
        return adminUserDAO.goAdminUnban(_id);
    }


    @PostMapping("/ban")
    public ResponseEntity<String> goBan(@RequestBody String _id)
    {
        return adminUserDAO.goAdminBan(_id);
    }

    @PostMapping("/search_user")
    public Document searchUser(@RequestBody String _id)
    {
        return adminUserDAO.AdminSearchUser(_id);
    }

    @GetMapping("/all_banned_users")
    public List<Document> retrieveBannedUser()
    {

        return adminUserDAO.adminGetBannedUser();
    }
}
