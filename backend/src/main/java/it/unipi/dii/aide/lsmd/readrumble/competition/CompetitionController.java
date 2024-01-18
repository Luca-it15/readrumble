package it.unipi.dii.aide.lsmd.readrumble.competition;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Updates;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDAO;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

@RestController
@RequestMapping("/api/competition")
@CrossOrigin(origins = "http://localhost:3000")
public class CompetitionController {
    private CompetitionDAO competitionDAO;

    public CompetitionController() {
        competitionDAO = new CompetitionDAO();
    }
    @PostMapping("/join")
    public ResponseEntity<String> joinCompetition(@RequestBody Document userDoc) {
        return competitionDAO.makeUserJoinCompetition(userDoc);

    }

    @GetMapping("/retrieve/all")
    public List<Document> retrieveAllCompetitions()
    {
        return competitionDAO.getAllCompetition();
    }
    @PostMapping("/retrieve/personal")
    public List<Document> retrievePersonalCompetitions(@RequestBody String _id)
    {
        return competitionDAO.getPersonalCompetition(_id);
    }
    @GetMapping("/retrieve/popular")
    public List<Document> retrievePopularCompetitions()
    {
        return competitionDAO.getPopularCompetitions();
    }
    @PostMapping("/getcompinfo")
    public Document getCompetitionInfo(@RequestBody Document docx)
    {
        return competitionDAO.goCompetitionInformation(docx);


    }
}
