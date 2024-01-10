package it.unipi.dii.aide.lsmd.readrumble.library;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "http://localhost:3000")
public class ActiveBookController {

    private ActiveBookDAO abd;
    @GetMapping("/title/{username}")
    public List<ActiveBookDTO> getBookTitlesByUsername(@PathVariable String username) {
        abd = new ActiveBookDAO();
        return abd.getActiveBooks(username);
    }
}
