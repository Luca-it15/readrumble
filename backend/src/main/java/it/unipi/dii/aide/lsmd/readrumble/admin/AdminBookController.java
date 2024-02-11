package it.unipi.dii.aide.lsmd.readrumble.admin;

import it.unipi.dii.aide.lsmd.readrumble.book.Book;
import it.unipi.dii.aide.lsmd.readrumble.config.web.CrossOriginConfig;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/book")
@CrossOrigin(origins = CrossOriginConfig.origin)
public class AdminBookController {

        AdminBookDAO adminBookDAO;
        public AdminBookController() {
            adminBookDAO = new AdminBookDAO();
        }

        @PostMapping("/add")
        public ResponseEntity<String> addBook(@RequestBody Book book) {
            return adminBookDAO.addBookTemp(book);
        }
        @DeleteMapping("/remove/{id}")
        public ResponseEntity<String> removeBook(@PathVariable long id) {
            return adminBookDAO.removeBookTemp(id);
        }

        @PostMapping("/update")
            public ResponseEntity<String> updateBook(@RequestBody Document changes) {
                return adminBookDAO.updateBookTemp(changes);
            }

}
