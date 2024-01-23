package it.unipi.dii.aide.lsmd.readrumble.book;

public class LightBookDTO {
    private Long id;
    private String title;

    public LightBookDTO(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }
}
