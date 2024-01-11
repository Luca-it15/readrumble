package it.unipi.dii.aide.lsmd.readrumble.library;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Active_book")
    class ActiveBook {
    @Id
    private String id;
    private String username;
    private int month;
    private int year;
    List<LibraryBook> books;

    public ActiveBook(String id, String username, int month, int year, List<LibraryBook> books) {
        this.id = id;
        this.username = username;
        this.month = month;
        this.year = year;
        this.books = books;
    }


    public String getId() {
        return id;
    }
    public String getUsername() {
        return username;
    }
    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public List<LibraryBook> getBooks() {
        return books;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setBooks(List<LibraryBook> books) {
        this.books = books;
    }

}
