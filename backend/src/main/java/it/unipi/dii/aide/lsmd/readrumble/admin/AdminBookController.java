package it.unipi.dii.aide.lsmd.readrumble.admin;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/book")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminBookController {

        AdminBookDAO adminBookDAO;
        public AdminBookController() {
            adminBookDAO = new AdminBookDAO();
        }

        @DeleteMapping("/remove/{id}")
        public String removeBook(@PathVariable int id) {
            return adminBookDAO.removeBook(id);
        }
}
