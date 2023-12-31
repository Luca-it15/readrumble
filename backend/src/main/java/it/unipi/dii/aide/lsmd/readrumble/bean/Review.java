package it.unipi.dii.aide.lsmd.readrumble.bean;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Id;

@Document(collection = "review")
public class Review {

    @Id
    private int id;
    private String title;
    private String username;
    private int numberOfPagesRead;
    private String review;
    private double rating;


    @Transient
    private String _class;
    // Costruttori

    public Review() {
        // Costruttore vuoto necessario per MongoDB
    }


    public Review(String title, String username, int numberOfPagesRead, String review, double rating) {
        this.title = title;
        this.username = username;
        this.numberOfPagesRead = numberOfPagesRead;
        this.review = review;
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }
    public String getUsername() {
        return username;
    }

    public int getNumberOfPagesRead() {
        return numberOfPagesRead;
    }

    public String getReview() {
        return review;
    }

    public double getRating() {
        return rating;
    }

    @Override
    public String toString() {
        return "Utente {" +
                "id='" + id + '\'' +
                ",  title'" +  title + '\'' +
                ", username='" + username + '\'' +
                ", numberOfPagesRead='" + numberOfPagesRead + '\'' +
                ", review='" + review + '\'' +
                ", rating='" + rating + '\'' +
                '}';
    }
}
