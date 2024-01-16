package it.unipi.dii.aide.lsmd.readrumble.post;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
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
    public String submitReview(@RequestBody Post post) {
      return postDAO.addPost(post);
    }

    /**
     * Function for retrieve the first 10 review and send them at the frontend
     * @return List<Review> include the first 10 review
     */
    @GetMapping("/all/{username}")
    public List<PostDTO> getAllReviewsUsers(@PathVariable String username) {
      return postDAO.allPostsUser(username);
    }
    @GetMapping("/all")
    public List<PostDTO> getAllReviews() {
        return postDAO.allPost();
    }



}
