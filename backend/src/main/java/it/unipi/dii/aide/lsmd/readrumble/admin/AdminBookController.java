package it.unipi.dii.aide.lsmd.readrumble.admin;

import it.unipi.dii.aide.lsmd.readrumble.book.Book;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/book")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminBookController {

        AdminBookDAO adminBookDAO;
        public AdminBookController() {
            adminBookDAO = new AdminBookDAO();
        }

        @PostMapping("/add")
        public String addBook(@RequestBody Book book) {
            return adminBookDAO.addBook(book);
        }
        @DeleteMapping("/remove/{id}")
        public String removeBook(@PathVariable long id) {
            return adminBookDAO.removeBook(id);
        }
}
