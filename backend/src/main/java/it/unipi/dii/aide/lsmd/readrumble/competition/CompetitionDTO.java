package it.unipi.dii.aide.lsmd.readrumble.competition;

import org.bson.conversions.Bson;
import org.springframework.data.annotation.Id;
import org.bson.Document;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date start_date = doc.get("start_date") instanceof String ? sdf.parse((String) doc.get("start_date")) : (Date) doc.get("start_date");
            Date end_date = doc.get("end_date") instanceof String ? sdf.parse((String) doc.get("end_date")) : (Date) doc.get("end_date");
            this.start_date= convertToLocalDate(start_date);
            this.end_date= convertToLocalDate(end_date);
        } catch (ParseException e) {
            System.out.println("Catched exception in parsing: "+e.getMessage());
            this.start_date = LocalDate.now();
            this.end_date = LocalDate.now().plusDays(1);
        }
        if(doc.containsKey("rank"))
        {
            this.rank = (ArrayList) doc.get("rank");
        }
        else
        {
            this.rank = new ArrayList<>();
        }
        if(this.end_date.isBefore(LocalDate.now()))
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
    public Document toDocument(){
        Document d = new Document();
        d.append("name",this.name);
        d.append("tag",this.tag);
        d.append("start_date",this.start_date);
        d.append("end_date",this.end_date);
        d.append("rank",this.rank);
        return d;
    }

}
