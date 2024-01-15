package it.unipi.dii.aide.lsmd.readrumble.user;

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
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private UserDAO userDAO;
    public UserController() {
        userDAO = new UserDAO();
    }

    @PostMapping("/user/quest")
    @ResponseBody
    public ResponseEntity<String> quest() {
        return ResponseEntity.ok("I'm Picking Up Good Vibrations");
    }
    @PostMapping("/login")
    public Document goLogin(@RequestBody Document utente) {
        User user = new User(utente);
        System.out.println(utente);
        System.out.println(user);
        return userDAO.LogUser(user);
    }

    @PostMapping("/change")
    public ResponseEntity<String> goChange(@RequestBody Document changes) {
        return userDAO.ChangeData(changes);
    }

    @PostMapping("/personalinfo")
    public Document retrieveInfo(@RequestBody Document utente) {
        User user = new User(utente);
        return userDAO.PersonalInfo(user);
    }

    @PostMapping("/registration")
    public ResponseEntity<String> inserisciDati(@RequestBody Document user) {
        return userDAO.RegUser(user);
    }

    @GetMapping("/user/all")
    public List<UserDTO> getAllReviews() {
        return userDAO.allUser();
    }
}
