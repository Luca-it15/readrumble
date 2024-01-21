package it.unipi.dii.aide.lsmd.readrumble.book;

public class LightBookDTO {
    private int id;
    private String title;

    public LightBookDTO(int id, String title) {
        this.id = id;
        this.title = title;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }
}
