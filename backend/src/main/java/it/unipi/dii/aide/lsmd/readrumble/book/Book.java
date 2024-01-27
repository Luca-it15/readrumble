package it.unipi.dii.aide.lsmd.readrumble.book;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Book")
public class Book {
    @Id
    private long id;
    private final String isbn;
    private final String description;
    private final String link;
    private final List<String> authors;
    private final String publisher;
    private final int num_pages;
    private final int publication_year;
    private final String url;
    private final String image_url;
    private String title;
    private final List<String> tags;

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



