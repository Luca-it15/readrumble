package it.unipi.dii.aide.lsmd.readrumble.library;

import java.util.ArrayList;
import java.util.List;

class LibraryBookDTO {

    private long book_id;
    private String book_title;


    private List<String> tags;
    private int bookmark;


    public LibraryBookDTO(long book_id, String book_title, List<String> tags, int bookmark) {
        this.book_id = book_id;
        this.book_title = book_title;
        this.tags = tags;
        this.bookmark = bookmark;
    }
    // getters
    public long getBook_id() {
        return book_id;
    }

    public String getBook_title() {
        return book_title;
    }

    public List<String> getTags() {
        return tags;
    }

    public int getBookmark() {
        return bookmark;
    }



}
