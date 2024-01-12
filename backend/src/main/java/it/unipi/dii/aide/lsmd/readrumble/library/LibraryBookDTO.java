package it.unipi.dii.aide.lsmd.readrumble.library;

import java.util.ArrayList;
import java.util.List;

class LibraryBookDTO {
    private String title;
    private List<String> tags;

    public LibraryBookDTO(String title) {
        this.title = title;
        this.tags = new ArrayList<>();
    }
    // getters
    public String getBookName() {
        return title;
    }

    public List<String> getTags() {
        return tags;
    }
    // setters
    public void setBookName(String book_name) {
        this.title = book_name;
    }
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

}
