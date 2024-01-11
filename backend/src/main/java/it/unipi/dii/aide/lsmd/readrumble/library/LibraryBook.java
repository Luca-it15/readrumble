package it.unipi.dii.aide.lsmd.readrumble.library;

import java.util.List;

class LibraryBook {
    private String title;
    private String genre;
    private List<String> tags;
    private int number_of_pages;
    private int book_point;
    private int state;

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

    public int getNumberOfPages() {
        return number_of_pages;
    }

    public int getBookPoint() {
        return book_point;
    }

    public int getState() {
        return state;
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

    public void setNumberOfPages(int number_of_pages) {
        this.number_of_pages = number_of_pages;
    }

    public void setBookPoint(int book_point) {
        this.book_point = book_point;
    }

    public void setState(int state) {
        this.state = state;
    }
}
