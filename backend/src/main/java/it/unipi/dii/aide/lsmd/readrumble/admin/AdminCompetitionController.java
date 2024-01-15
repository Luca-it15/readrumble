package it.unipi.dii.aide.lsmd.readrumble.admin;

import it.unipi.dii.aide.lsmd.readrumble.competition.CompetitionDAO;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/competition")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminCompetitionController {
    private AdminCompetitionDAO adminCompetitionDAO;
    public AdminCompetitionController() {
        adminCompetitionDAO = new AdminCompetitionDAO();
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteCompetition(@RequestBody Document params) {
        return adminCompetitionDAO.adminDeleteCompetition(params);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCompetition(@RequestBody Document params) {
        return adminCompetitionDAO.adminAddCompetition(params);
    }
}