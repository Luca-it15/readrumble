package it.unipi.dii.aide.lsmd.readrumble.post;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

/**
 * Post class rappresent the posts collection in mongoDB
 */


@Document(collection = "Posts")
public class Post {


    @Id
    private long _id;
    private int book_id;
    private int rating;
    private String review_text;
    private Date date_added;
    private String book_title;
    private String username;
    private List<String> tags;
    private int bookmark;
    private int pages_read;

    @Transient
    private String _class;
    // Costruttori

    public Post() {
        // Costruttore vuoto necessario per MongoDB
    }


    public Post(long _id, int book_id, int rating, String review_text, Date date, String book_title, String username,  int bookmark) {
        this._id = _id;
        this.book_id = book_id;
        this.rating = rating;
        this.review_text = review_text;
        this.date_added = date;
        this.book_title = book_title;
        this.username = username;
        this.bookmark = bookmark;
    }

    public long get_id() {
        return _id;
    }

    public void set_id(int _id) {
        this._id = _id;
    }

    public int getBook_id() {
        return book_id;
    }

    public void setBook_id(int book_id) {
        this.book_id = book_id;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getReview_text() {
        return review_text;
    }

    public void setReview_text(String review_text) {
        this.review_text = review_text;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getBookmark() {
        return bookmark;
    }

    public void setBookmark(int bookmark) {
        this.bookmark = bookmark;
    }

    public int getPages_read() {
        return pages_read;
    }

    public void setPages_read(int pages_read) {
        this.pages_read = pages_read;
    }


}
