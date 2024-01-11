package it.unipi.dii.aide.lsmd.readrumble.library;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "http://localhost:3000")
public class ActiveBookController {

    private LibraryBookDAO abd;
    @GetMapping("/title/{username}")
    public List<LibraryBookDTO> getBookTitlesByUsername(@PathVariable String username) {
        abd = new LibraryBookDAO();
        return abd.getLibraryBooks(username);
    }
}
