package it.unipi.dii.aide.lsmd.readrumble.book;

public class LightBookDTO {
    private long id;
    private String title;

    public LightBookDTO(long id, String title) {
        this.id = id;

        this.title = title;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
