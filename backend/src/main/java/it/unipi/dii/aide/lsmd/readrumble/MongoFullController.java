package it.unipi.dii.aide.lsmd.readrumble;

import com.mongodb.client.*;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminBookController;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.config.web.CrossOriginConfig;
import it.unipi.dii.aide.lsmd.readrumble.post.PostController;
import it.unipi.dii.aide.lsmd.readrumble.search.SearchController;
import it.unipi.dii.aide.lsmd.readrumble.user.UserController;
import it.unipi.dii.aide.lsmd.readrumble.book.BookController;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = CrossOriginConfig.origin)
public class MongoFullController {
    private final UserController userController;
    private final CompetitionController competitionController;
    private final AdminCompetitionController adminCompetitionController;
    private final PostController postController;
    private final BookController bookController;
    private final SearchController searchController;
    private final AdminBookController adminBookController;

    @Autowired
    public MongoFullController(UserController userController,
                               CompetitionController competitionController,
                               PostController postController,
                               AdminCompetitionController adminCompetitionController,
                               BookController bookController,
                               SearchController searchController,
                               AdminBookController adminBookController) {
        this.userController = userController;
        this.competitionController = competitionController;
        this.adminCompetitionController = adminCompetitionController;
        this.postController = postController;
        this.bookController = bookController;
        this.searchController = searchController;
        this.adminBookController = adminBookController;
    }
}


