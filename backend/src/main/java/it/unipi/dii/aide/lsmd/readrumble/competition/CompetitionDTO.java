package it.unipi.dii.aide.lsmd.readrumble.competition;

import org.bson.conversions.Bson;
import org.springframework.data.annotation.Id;
import org.bson.Document;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class CompetitionDTO {

    private String name;
    private String tag;
    private LocalDate start_date;
    private LocalDate end_date;
    private ArrayList rank;
    private Boolean isEnded;
    //false means that the competition is active
    //true means that the competition is ended

    public CompetitionDTO() {
    }

    public CompetitionDTO(String name, String tag, LocalDate start_date, LocalDate end_date, ArrayList rank) {
        this.name = name;
        this.tag = tag;
        this.start_date=start_date;
        this.end_date=end_date;
        this.rank = rank;
        if(end_date.isBefore(LocalDate.now()))
        {
            this.isEnded=true;
        }
        else
        {
            this.isEnded=false;
        }
    }
    public LocalDate convertToLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
    public CompetitionDTO(Document doc) {
        this.name = doc.get("name").toString();
        this.tag = doc.get("tag").toString();
        this.start_date= convertToLocalDate((Date) doc.get("start_date"))  ;
        LocalDate end_date = convertToLocalDate((Date) doc.get("end_date"));
        this.end_date= end_date;
        this.rank = (ArrayList) doc.get("rank");
        if(end_date.isBefore(LocalDate.now()))
        {
            this.isEnded=true;
        }
        else
        {
            this.isEnded=false;
        }
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
    public Boolean getIsEnded() {
        return isEnded;
    }

    public void setIsEnded(Boolean isEnded) {
        this.isEnded = isEnded;
    }
    public LocalDate getStartDate() {
        return start_date;
    }

    public void setStartDate(LocalDate start_date) {
        this.start_date = start_date;
    }
    public LocalDate getEndDate() {
        return end_date;
    }

    public void setEndDate(LocalDate end_date) {
        this.end_date = end_date;
    }

    public ArrayList getRank() {
        return rank;
    }

    public void setRank(ArrayList rank) {
        this.rank = rank;
    }
    @Override
    public String toString() {
        return "Competition {" +
                "name='" + name + '\'' +
                ",  tag='" + tag + '\'' +
                ", start_date='" + start_date + '\'' +
                ", end_date='" + end_date + '\'' +
                '}';
    }

}
