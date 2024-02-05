package it.unipi.dii.aide.lsmd.readrumble.competition;

import org.bson.conversions.Bson;
import org.springframework.data.annotation.Id;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;


public class CompetitionDTO {

    private String name;
    private String tag;
    private ArrayList rank;

    public CompetitionDTO() {
    }

    public CompetitionDTO(String name, String tag, ArrayList rank) {
        this.name = name;
        this.tag = tag;
        this.rank = rank;
    }
    public CompetitionDTO(Document doc) {
        this.name = doc.get("name").toString();
        this.tag = doc.get("tag").toString();
        this.rank = (ArrayList) doc.get("rank");
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public ArrayList getRank() {
        return rank;
    }

    public void setRank(ArrayList rank) {
        this.rank = rank;
    }


}
