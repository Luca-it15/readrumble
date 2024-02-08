package it.unipi.dii.aide.lsmd.readrumble.admin;

import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/competition")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminCompetitionController {
    private AdminCompetitionDAO adminCompetitionDAO;
    public AdminCompetitionController() {
        adminCompetitionDAO = new AdminCompetitionDAO();
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteCompetitionInFuture(@RequestBody Document params) {
        String competition_name = (String) params.get("name");
        if(competition_name!=null)
        {
            adminCompetitionDAO.saveInMemoryCompetitionsToDelete(competition_name);
            return ResponseEntity.ok("The competition will be deleted in the next 24 hours");
        }
        return ResponseEntity.ok("the field 'name' is empty");
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCompetition(@RequestBody Document params){
        return adminCompetitionDAO.adminAddCompetition(params);
    }

    /**
     * This method is used to retrieve the list of tags and average points of the last six months, based on the first 10 users in ranking
     *
     * @return the list of tags and average points of the last 12 months
     */
    @GetMapping("/analytic/pagesByTag")
    public Map<String, Integer> getPagesByTag() {
        AdminCompetitionDAO adminCompetitionDAO = new AdminCompetitionDAO();
        return adminCompetitionDAO.getPagesByTag();
    }

    /**
     * This method is used to retrieve the list of months and average points by tag of the last 12 months, based on the first 10 users in the rankings
     *
     * @return the list of tags and average points of the last six months
     */
    @GetMapping("/analytic/pagesByMonthAndTag")
    public Map<String, Map<String, Integer>> getPagesByMonthAndTag() {
        AdminCompetitionDAO adminCompetitionDAO = new AdminCompetitionDAO();
        return adminCompetitionDAO.getPagesByMonthAndTag();
    }
}