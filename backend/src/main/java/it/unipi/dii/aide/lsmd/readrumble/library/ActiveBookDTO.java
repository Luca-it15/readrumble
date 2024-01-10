package it.unipi.dii.aide.lsmd.readrumble.library;

import org.springframework.data.annotation.Id;

public class ActiveBookDTO {

    @Id
    private String id;
    private String title;

    public ActiveBookDTO(String title) {
        this.title = title;
    }
    public String getId() {return id;}
    public String getTitle() {
        return title;
    }
    public void setId(String i) {
        id = i;
    }

    public void setTitle(String s) {
        title = s;
    }

}



