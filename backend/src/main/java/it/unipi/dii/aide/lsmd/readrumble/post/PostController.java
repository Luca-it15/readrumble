package it.unipi.dii.aide.lsmd.readrumble.post;


import it.unipi.dii.aide.lsmd.readrumble.config.web.CrossOriginConfig;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDTO;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@CrossOrigin(origins = CrossOriginConfig.origin)
public class PostController {
    private PostDAO postDAO;

    public PostController() {
        postDAO = new PostDAO();
    }

    /**
     * <h3>Review functionality</h3>
     * <p>
     * Funcion to insert a review into the reviews collection
     *
     * @param post contains the request body
     * @return the response string
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitPost(@RequestBody Document post) {
        return postDAO.addPostsRedis(post);
    }

    /**
     * Function to retrieve the first 10 review and send them at the frontend
     *
     * @param parameter the username of the user that calls this method if the param user is true
     *                  or the book_id if the value of user is false
     * @param user_or_book that is true if the method was called to retrieve the posts of the user or false
     *                  if it was called to retrieve a book's posts
     * @return List<Review> includes the first 10 reviews
     */
    @GetMapping("/all/{parameter}/{user_or_book}")
    public List<PostDTO> getAllPost(@PathVariable String parameter, @PathVariable boolean user_or_book) {
        return postDAO.allPosts(parameter, user_or_book, false);
    }

    @GetMapping("/morePosts/{parameter}/{user_or_book}")
    public List<PostDTO> getMorePosts(@PathVariable String parameter, @PathVariable boolean user_or_book) {
        return postDAO.allPosts(parameter, user_or_book, true);
    }

    @GetMapping("/details/{id}/{parameter}/{user}")
    public Post getPostDetails(@PathVariable ObjectId id, @PathVariable String parameter,  @PathVariable boolean user) {
        return postDAO.postDetails(id, parameter, user);
    }

    @DeleteMapping("/removeredis/{key}")
    public ResponseEntity<String> removePostUserRedis(@PathVariable String key) {
        return postDAO.removePostRedis(key);
    }

    @DeleteMapping("/removemongo/{id}")
    public ResponseEntity<String> removePostUserMongo(@PathVariable ObjectId id) {
        return postDAO.removePostMongo(id);
    }

    @PostMapping("/friends/{username}")
    public List<PostDTO> recentFriendsPosts(@PathVariable String username) {
        return postDAO.getRecentFriendsPosts(username);
    }
}
