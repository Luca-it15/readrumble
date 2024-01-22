package it.unipi.dii.aide.lsmd.readrumble.post;


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
    public String submitPost(@RequestBody Post post) {
      return postDAO.addPost(post);
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
    public Post getPostDetails(@PathVariable long id) {
        return postDAO.postDetails(id);
    }
    @GetMapping("/all")
    public List<PostDTO> getAllReviews() {
        return postDAO.allPost();
    }

    @DeleteMapping("/remove/{id}")
    public String removePostUser(@PathVariable long id) {
        return postDAO.removePost(id);
    }

    @GetMapping("/findSearchPosts/{searchString}")
     public List<PostDTO> findSearchPosts(@PathVariable String searchString) {
        return postDAO.findForStringPosts(searchString);
    }



}
