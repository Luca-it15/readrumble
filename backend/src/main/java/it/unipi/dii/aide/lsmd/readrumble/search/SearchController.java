package it.unipi.dii.aide.lsmd.readrumble.search;


import it.unipi.dii.aide.lsmd.readrumble.book.LightBookDTO;
import it.unipi.dii.aide.lsmd.readrumble.post.PostDTO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {
    private SearchDao searchDao;

    public SearchController() {
        searchDao = new SearchDao();
    }
    @GetMapping("/posts/{searchString}")
    public List<PostDTO> searchPosts(@PathVariable String searchString) {
        return searchDao.findForStringPosts(searchString);
    }
    @GetMapping("/users/{searchString}")
    public List<UserDTO> searchUsers(@PathVariable String searchString) {
        return searchDao.findForStringUsers(searchString);
    }
    @GetMapping("/books/{searchString}")
    public List<LightBookDTO> searchBooks(@PathVariable String searchString) {
        return searchDao.findForStringBooks(searchString);
    }


}
