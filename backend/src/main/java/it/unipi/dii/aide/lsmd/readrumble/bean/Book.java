package it.unipi.dii.aide.lsmd.readrumble.bean;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Book_sub")
public class Book {

    @Id
    private String id;
    private String title;

    @Transient
    private String _class;
    // Costruttori

    public Book() {
        // Costruttore vuoto necessario per MongoDB
    }

    public String getTitle() {
        return title;
    }
    public void setId(String i) {
        id = i;
    }

    public void setTitle(String s) {
        title = s;
    }

}



