package it.unipi.dii.aide.lsmd.readrumble.post;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

/**
 * PostDTO class rappresent a part of the posts class,
 * this is the information that we pass in the DAO class
 * and we send to the client
 */


public class PostDTO {

    private int _id;
    private int rating;
    private Date date_added;
    private String book_title;
    private String username;


    public PostDTO(int _id, int rating, Date date, String book_title, String username) {
        this._id = _id;
        this.rating = rating;
        this.date_added = date;
        this.book_title = book_title;
        this.username = username;
    }

    public int get_id() {
        return _id;
    }

    public void set_id(int _id) {
        this._id = _id;
    }


    public void setRating(int rating) {
        this.rating = rating;
    }

    public Date getDate_added() {
        return date_added;
    }

    public void setDate_added(Date date_added) {
        this.date_added = date_added;
    }

    public String getBook_title() {
        return book_title;
    }

    public void setBook_title(String book_title) {
        this.book_title = book_title;
    }

    public void setUsername(String username) {
        this.username = username;
    }


}
