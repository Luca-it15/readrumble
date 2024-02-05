package it.unipi.dii.aide.lsmd.readrumble.competition;

import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisClusterConfig;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
import org.bson.Document;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.*;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;
import static it.unipi.dii.aide.lsmd.readrumble.utils.PatternKeyRedis.KeysTwo;
import java.util.*;

@RestController
@RequestMapping("/api/competition")
@CrossOrigin(origins = "http://localhost:3000")
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
        Logger logger = org.slf4j.LoggerFactory.getLogger(CompetitionController.class);

        JedisCluster jedis = RedisClusterConfig.getInstance().getJedisCluster();
        String pattern = "competition:*:*:"+id;

        logger.info("Fetching competitions for user: " + id);

        List<String> keys = KeysTwo(jedis, pattern);

        logger.info("Keys found");

        if (keys.isEmpty()) {
            return new ArrayList<>();
        }

        List<Map<String, String>> competitions = new ArrayList<>();

        for (String key : keys) {
            String competition = key.split(":")[1]; // Competition name
            String tag = key.split(":")[2]; // Competition tag

            Integer pages = Integer.parseInt(String.valueOf(jedis.get(key)));

            Map<String, String> competitionMap = new HashMap<>();
            competitionMap.put("name", competition);
            competitionMap.put("pages", String.valueOf(pages));
            competitionMap.put("tag", tag);
            competitions.add(competitionMap);
        }

        return competitions;
    }
}
