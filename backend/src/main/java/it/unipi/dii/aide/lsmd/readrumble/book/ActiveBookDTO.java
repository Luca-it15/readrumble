package it.unipi.dii.aide.lsmd.readrumble.book;

import java.util.List;

public class ActiveBookDTO {

    private long id;
    private String title;
    private List<String> tags;
    private int bookmark;
    private int num_pages;

    public ActiveBookDTO(long id, String title, List<String> tags, int bookmark, int num_pages) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.bookmark = bookmark;
        this.num_pages = num_pages;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public int getNum_pages() {
        return num_pages;
    }

    public void setNum_pages(int num_pages) {
        this.num_pages = num_pages;
    }
}
