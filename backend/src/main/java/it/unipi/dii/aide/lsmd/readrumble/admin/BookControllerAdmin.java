package it.unipi.dii.aide.lsmd.readrumble.admin;

import it.unipi.dii.aide.lsmd.readrumble.book.Book;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/book")
@CrossOrigin(origins = "http://localhost:3000")
public class BookControllerAdmin {

    @PostMapping("/add")
    public String submitReview(@RequestBody Book book) {
        return "ok";
    }


}
