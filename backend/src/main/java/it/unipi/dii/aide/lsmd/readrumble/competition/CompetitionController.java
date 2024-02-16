package it.unipi.dii.aide.lsmd.readrumble.competition;

import it.unipi.dii.aide.lsmd.readrumble.config.web.CrossOriginConfig;

import org.bson.Document;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/competition")
@CrossOrigin(origins = CrossOriginConfig.origin)
public class CompetitionController {
    private CompetitionDAO competitionDAO;

    public CompetitionController() {
        competitionDAO = new CompetitionDAO();
    }

    @PostMapping("/joinleave")
    public ResponseEntity<String> joinOrLeaveCompetition(@RequestBody Document userDoc) {
        return competitionDAO.userJoinsOrLeavesCompetition(userDoc);

    }

    @GetMapping("/retrieve/all")
    public List<CompetitionDTO> retrieveAllCompetitions()
    {
        return competitionDAO.getAllCompetition();
    }

    @GetMapping("/retrieve/popular")
    public List<Document> retrievePopularCompetitions()
    {
        return competitionDAO.getPopularCompetitions();
    }

    @PostMapping("/getcompinfo")
    public CompetitionDTO getCompetitionInfo(@RequestBody Document docx)
    {
        return competitionDAO.goCompetitionInformation(docx);
    }

    /**
     * This method is used to retrieve the list of competitions joined by a user and their points
     *
     * @param id the id of the user
     * @return the list of competitions joined by the user
     */
    @GetMapping("/joinedBy/{id}")
    public List<Map<String, String>> getJoinedCompetitions(@PathVariable String id) {
        return competitionDAO.getJoinedBy(id);
    }
}
