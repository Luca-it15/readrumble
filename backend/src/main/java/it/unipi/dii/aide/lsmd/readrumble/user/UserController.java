package it.unipi.dii.aide.lsmd.readrumble.user;

import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    public Document goLogin(@RequestBody Document loggingUser) {
        User user = new User(loggingUser);

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

    /**
     * This method returns the followees of a user
     *
     * @param username the username of the user
     * @return the list of friends
     */
    @GetMapping("/following/{username}")
    public List<String> getFollowing(@PathVariable String username) {
        return userDAO.getFollowing(username);
    }

    /**
     * This method creates the relation :FOLLOWS from follower to followee
     *
     * @param follower the username of the follower
     * @param followee the username of the "soon to be" followed
     * @return a ResponseEntity with the result of the operation
     */
    @PostMapping("/follow/{follower}/{followee}")
    public ResponseEntity<String> follow(@PathVariable String follower, @PathVariable String followee) {
        return userDAO.follow(follower, followee);
    }

    /**
     * This method deletes the relation :FOLLOWS from follower to followee
     *
     * @param follower the username of the follower
     * @param followee the username of the "soon to be" unfollowed
     * @return a ResponseEntity with the result of the operation
     */
    @DeleteMapping("/unfollow/{follower}/{followee}")
    public ResponseEntity<String> unfollow(@PathVariable String follower, @PathVariable String followee) {
        return userDAO.unfollow(follower, followee);
    }

    /**
     * This method returns a list of suggested friends for the user with the given username
     *
     * @param username the username of the user
     * @return the list of suggested friends
     */
    @GetMapping("/suggestedFriends/{username}")
    public List<Map<String, Object>> getSuggestedFriends(@PathVariable String username) {
        return userDAO.getSuggestedFriends(username);
    }
}
