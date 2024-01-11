package it.unipi.dii.aide.lsmd.readrumble.library;

import java.util.ArrayList;
import java.util.List;

class LibraryBookDTO {
    private String title;
    private String genre;
    private List<String> tags;

    public LibraryBookDTO(String title, String genre) {
        this.title = title;
        this.genre = genre;
        this.tags = new ArrayList<>();
    }
    // getters
    public String getBookName() {
        return title;
    }

    public String getGenre() {
        return genre;
    }

    public List<String> getTags() {
        return tags;
    }
    // setters
    public void setBookName(String book_name) {
        this.title = book_name;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

}
