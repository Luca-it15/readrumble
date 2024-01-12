package it.unipi.dii.aide.lsmd.readrumble.review;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "review")
public class ReviewDTO {

    @Id
    private int id;
    private String title;
    private String username;
    private int numberOfPagesRead;
    private String review;
    private double rating;
    private List<String> tags;

    private Date date;

    @Transient
    private String _class;
    // Costruttori

    public ReviewDTO() {
        // Costruttore vuoto necessario per MongoDB
    }


    public ReviewDTO(String title, String username, int numberOfPagesRead, String review, double rating, Date date) {
        this.title = title;
        this.username = username;
        this.numberOfPagesRead = numberOfPagesRead;
        this.review = review;
        this.rating = rating;
        this.date = date;
        this.tags = new ArrayList<>();
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

    public Date getDate() {
        return date;
    }
    public List<String>getTags() {return tags;}

    @Override
    public String toString() {
        return "review {" +
                "id='" + id + '\'' +
                ",  title'" +  title + '\'' +
                ", username='" + username + '\'' +
                ", numberOfPagesRead='" + numberOfPagesRead + '\'' +
                ", review='" + review + '\'' +
                ", rating='" + rating + '\'' +
                ", data='" + date + '\'' +
                '}';
    }
}
