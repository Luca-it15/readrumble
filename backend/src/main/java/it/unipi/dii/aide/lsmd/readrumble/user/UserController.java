package it.unipi.dii.aide.lsmd.readrumble.user;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private UserDAO userDAO;
    public UserController() {
        userDAO = new UserDAO();
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

    /**
     * This method adds a user to the document DB and to the graph DB
     *
     * @param user the user to add
     * @return the response entity
     */
    @PostMapping("/registration")
    public ResponseEntity<String> registerUser(@RequestBody Document user) {
        return userDAO.RegUser(user);
    }

    /**
     *
     *
     */
    @GetMapping("/user/all")
    public List<UserDTO> getAllReviews() {
        return userDAO.allUser();
    }

    /**
     * This method returns name and surname of the user with the given username
     *
     * @param username the username of the user
     * @return the user with the given username
     */
    @GetMapping("/user/{username}")
    public Map<String, String> getUser(@PathVariable String username) {
        return userDAO.getUser(username);
    }
}
