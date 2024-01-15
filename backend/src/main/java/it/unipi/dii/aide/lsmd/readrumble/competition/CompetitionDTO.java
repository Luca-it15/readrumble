package it.unipi.dii.aide.lsmd.readrumble.competition;

import org.bson.conversions.Bson;
import org.springframework.data.annotation.Id;
import org.bson.Document;


public class CompetitionDTO {

    private String name;
    private String tag;
    private Document rank;
    private String isJoin;

    // Costruttore senza parametri
    public CompetitionDTO() {
    }

    // Costruttore con parametri
    public CompetitionDTO(String name, String tag, Document rank, String isJoin) {
        this.name = name;
        this.tag = tag;
        this.rank = rank;
        this.isJoin = isJoin;
    }

    // Metodi getter e setter per il campo 'name'
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Metodi getter e setter per il campo 'tag'
    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    // Metodi getter e setter per il campo 'rank'
    public Document getRank() {
        return rank;
    }

    public void setRank(Document rank) {
        this.rank = rank;
    }

    // Metodi getter e setter per il campo 'isJoin'
    public String getIsJoin() {
        return isJoin;
    }

    public void setIsJoin(String isJoin) {
        this.isJoin = isJoin;
    }
}
