package it.unipi.dii.aide.lsmd.readrumble.competition;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import it.unipi.dii.aide.lsmd.readrumble.config.database.RedisConfig;
@RestController
@RequestMapping("/api/redis_competition")
@CrossOrigin(origins = "http://localhost:3000")
public class RedisCompetitionController {

}
