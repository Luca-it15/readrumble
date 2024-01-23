package it.unipi.dii.aide.lsmd.readrumble.book;

import java.util.List;

public class BookDTO {
    private long id;
    private String isbn;
    private String title;
    private List<String> authors;
    private String publisher;
    private int publication_year;
    private int num_pages;
    private List<String> tags;
    private String description;
    private String cover_url;
    private String url;

    public BookDTO(long id, String isbn, String title, List<String> authors, int publication_year, String publisher,
                   List<String> tags, int num_pages, String description, String cover_url, String url) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.authors = authors;
        this.publication_year = publication_year;
        this.publisher = publisher;
        this.tags = tags;
        this.num_pages = num_pages;
        this.description = description;
        this.cover_url = cover_url;
        this.url = url;
    }

    public BookDTO() {

    }

    // Getters and setters

    public long getId() {
        return id;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getTitle() {
        return title;
    }

    public List<String> getAuthors() {
        return authors;
    }

    public String getPublisher() {
        return publisher;
    }

    public int getPublication_year() {
        return publication_year;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getDescription() {
        return description;
    }

    public String getCover_url() {
        return cover_url;
    }

    public String getUrl() {
        return url;
    }

    public int getNum_pages() {
        return num_pages;
    }

    public void setNum_pages(int num_pages) {
        this.num_pages = num_pages;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public void setPublication_year(int publication_year) {
        this.publication_year = publication_year;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCover_url(String cover_url) {
        this.cover_url = cover_url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
