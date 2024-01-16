package it.unipi.dii.aide.lsmd.readrumble.library;

import java.util.ArrayList;
import java.util.List;

class LibraryBookDTO {

    private int book_id;
    private String book_title;

    public LibraryBookDTO(int book_id, String book_title) {
        this.book_id = book_id;
        this.book_title = book_title;
    }
    // getters
    public int getBook_id() {
        return book_id;
    }

    public String getBook_title() {
        return book_title;
    }

}
