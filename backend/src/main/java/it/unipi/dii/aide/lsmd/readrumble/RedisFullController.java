package it.unipi.dii.aide.lsmd.readrumble;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminBookController;
import it.unipi.dii.aide.lsmd.readrumble.admin.AdminCompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.book.BookController;
import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.competition.RedisCompetitionController;
import it.unipi.dii.aide.lsmd.readrumble.library.ActiveBookController;
import it.unipi.dii.aide.lsmd.readrumble.post.PostController;
import it.unipi.dii.aide.lsmd.readrumble.search.SearchController;
import it.unipi.dii.aide.lsmd.readrumble.user.UserController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RedisFullController {
    private final RedisCompetitionController redisCompetitionController;
    @Autowired
    public RedisFullController(
                               RedisCompetitionController redisCompetitionController
                               ) {
        this.redisCompetitionController = redisCompetitionController;

    }
}
