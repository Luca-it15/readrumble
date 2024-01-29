package it.unipi.dii.aide.lsmd.readrumble.post;

import java.util.Date;

/**
 * PostDTO class rappresent a part of the posts class,
 * this is the information that we pass in the DAO class
 * and we send to the client
 */


public class PostDTO {

    private String _id;
    private long book_id;
    private int rating;
    private Date date_added;
    private String book_title;
    private String username;
    private String text;


    public PostDTO(String _id, long book_id, int rating, Date date, String book_title, String username, String text) {
        this._id = _id;
        this.book_id = book_id;
        this.rating = rating;
        this.date_added = date;
        this.book_title = book_title;
        this.username = username;
        this.text = text;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public long getBook_id() {
        return book_id;
    }

    public int getRating() {
        return rating;
    }

    public String getUsername() {
        return username;
    }

    public String getText() {
        return text;
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

    public void setText(String text) {
        this.text = text;
    }
}
