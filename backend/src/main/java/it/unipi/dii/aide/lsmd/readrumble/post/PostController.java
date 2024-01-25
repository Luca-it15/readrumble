package it.unipi.dii.aide.lsmd.readrumble.post;


import it.unipi.dii.aide.lsmd.readrumble.user.UserDTO;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    private PostDAO postDAO;

    public PostController() {
        postDAO = new PostDAO();
    }
    /**
     * <h3>Review functionality</h3>
     *
     * Funcion for insert a review into the reviews collection
     * @param  post
     * post contain the request body
     * @return String
     * return the response
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitPost(@RequestBody Post post) {
      return postDAO.addPostsRedis(post);
    }

    /**
     * Function for retrieve the first 10 review and send them at the frontend
     * @param parametro that contain the username of the user that call this method if the param user is true
     *                  o the book_id if the value of user is false
     * @param user that contain true if the method was call for retrieve the post of the user or false
     *             if we need to retrieve the book post
     * @return List<Review> include the first 10 review
     */
    @GetMapping("/all/{parametro}/{user}")
    public List<PostDTO> getAllPostUsers(@PathVariable String parametro, @PathVariable boolean user) {
        return postDAO.allPostsUser(parametro, user);
    }
    @GetMapping("/details/{id}")
    public Post getPostDetails(@PathVariable ObjectId id) {
        return postDAO.postDetails(id);
    }
    @GetMapping("/all")
    public List<PostDTO> getAllReviews() {
        return postDAO.allPost();
    }

    @DeleteMapping("/remove/{id}")
    public String removePostUser(@PathVariable ObjectId id) {
        return postDAO.removePost(id);
    }

    @PostMapping("/friends")
    public List<PostDTO> recentFriendsPosts(@RequestBody List<String> friends) {
        return postDAO.getRecentFriendsPosts(friends);
    }

}
