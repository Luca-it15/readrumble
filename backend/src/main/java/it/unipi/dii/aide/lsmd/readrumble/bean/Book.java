package it.unipi.dii.aide.lsmd.readrumble.bean;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Book_sub")
public class Book {
    private String title;

    public String getTitle() {
        return title;
    }
}

