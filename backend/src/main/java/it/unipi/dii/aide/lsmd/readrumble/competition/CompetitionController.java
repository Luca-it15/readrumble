package it.unipi.dii.aide.lsmd.readrumble.competition;

import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import java.util.*;

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
        return competitionDAO.userJoinsCompetition(userDoc);

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

    /**
     * This method is used to retrieve the list of competitions joined by a user and their points
     *
     * @param id the id of the user
     * @return the list of competitions joined by the user
     */
    @GetMapping("/joinedBy/{id}")
    public List<Map<String, String>> getJoinedCompetitions(@PathVariable String id) {
        Jedis jedis = RedisConfig.getSession();

        Set<String> keys = jedis.keys("competition:*:" + id);

        if (keys.isEmpty()) {
            return new ArrayList<>();
        }

        List<Map<String, String>> competitions = new ArrayList<>();

        for (String key : keys) {
            String competition = key.split(":")[1]; // Competition name
            String tag = key.split(":")[3]; // Competition tag

            Integer pages = Integer.parseInt(jedis.get(key));

            Map<String, String> competitionMap = new HashMap<>();
            competitionMap.put("name", competition);
            competitionMap.put("pages", String.valueOf(pages));
            competitionMap.put("tag", tag);
            competitions.add(competitionMap);
        }

        return competitions;
    }
}
