package it.unipi.dii.aide.lsmd.readrumble.search;


import it.unipi.dii.aide.lsmd.readrumble.book.LightBookDTO;
import it.unipi.dii.aide.lsmd.readrumble.config.web.CrossOriginConfig;
import it.unipi.dii.aide.lsmd.readrumble.post.PostDTO;
import it.unipi.dii.aide.lsmd.readrumble.user.UserDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = CrossOriginConfig.origin)
public class SearchController {
    private SearchDAO searchDao;

    public SearchController() {
        searchDao = new SearchDAO();
    }
    @GetMapping("/posts/{searchString}/{isAdmin}")
    public List<PostDTO> searchPosts(@PathVariable String searchString, @PathVariable boolean isAdmin) {
        return searchDao.findByStringPosts(searchString, isAdmin);
    }
    @GetMapping("/users/{searchString}")
    public List<UserDTO> searchUsers(@PathVariable String searchString) {
        return searchDao.findByStringUsers(searchString);
    }
    @GetMapping("/books/{searchString}")
    public List<LightBookDTO> searchBooks(@PathVariable String searchString) {
        return searchDao.findByStringBooks(searchString);
    }
    @GetMapping("/books")
    public List<LightBookDTO> getLastBooks() {
        return searchDao.getLastBooks();
    }





}
