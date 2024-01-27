package it.unipi.dii.aide.lsmd.readrumble;

import it.unipi.dii.aide.lsmd.readrumble.competition.RedisCompetitionController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RedisFullController {
    private final RedisCompetitionController redisCompetitionController;

    @Autowired
    public RedisFullController(RedisCompetitionController redisCompetitionController) {
        this.redisCompetitionController = redisCompetitionController;
    }
}
