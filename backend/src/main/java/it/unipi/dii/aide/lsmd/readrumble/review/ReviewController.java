package it.unipi.dii.aide.lsmd.readrumble.review;


import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
    private ReviewDAO reviewDAO;

    public ReviewController() {
        reviewDAO = new ReviewDAO();
    }
    /**
     * <h3>Review functionality</h3>
     *
     * Funcion for insert a review into the reviews collection
     * @param  review
     * review is a Review riferiment
     * @return String
     * return the response
     */
    @PostMapping("/submit")
    public String submitReview(@RequestBody ReviewDTO review) {
      return reviewDAO.addReview(review);
    }

    /**
     * Function for retrieve the first 10 review and send them at the frontend
     * @return List<Review> include the first 10 review
     */
    @GetMapping("/all/{username}")
    public List<ReviewDTO> getAllReviewsUsers(@PathVariable String username) {
      return reviewDAO.allReviewUser(username);
    }
    @GetMapping("/all")
    public List<ReviewDTO> getAllReviews() {
        return reviewDAO.allReview();
    }



}
