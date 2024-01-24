package it.unipi.dii.aide.lsmd.readrumble.book;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Book")
public class Book {
    @Id
    private long id;
    private String isbn;
    private String description;
    private String link;
    private List<String> authors;
    private String publisher;
    private int num_pages;
    private int publication_year;
    private String url;
    private String image_url;
    private String title;
    private List<String> tags;

    @Transient
    private String _class;
    // Costruttori

    public Book() {
        // Costruttore vuoto necessario per MongoDB
    }

    public Book(long id, String isbn, String description, String link, List<String> authors, String publisher, int num_pages, int publication_year, String url, String image_url, String title, List<String> tags) {
        this.id = id;
        this.isbn = isbn;
        this.description = description;
        this.link = link;
        this.authors = authors;
        this.publisher = publisher;
        this.num_pages = num_pages;
        this.publication_year = publication_year;
        this.url = url;
        this.image_url = image_url;
        this.title = title;
        this.tags = tags;
    }

    public String getTitle() {
        return title;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getDescription() {
        return description;
    }

    public String getLink() {
        return link;
    }

    public List<String> getAuthors() {
        return authors;
    }

    public String getPublisher() {
        return publisher;
    }

    public int getNum_pages() {
        return num_pages;
    }

    public int getPublication_year() {
        return publication_year;
    }

    public String getUrl() {
        return url;
    }

    public String getImage_url() {
        return image_url;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setId(long i) {
        id = i;
    }

    public void setTitle(String s) {
        title = s;
    }
}



