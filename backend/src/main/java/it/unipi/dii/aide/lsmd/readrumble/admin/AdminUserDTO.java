package it.unipi.dii.aide.lsmd.readrumble.admin;

import org.bson.Document;
import org.springframework.data.annotation.Id;

public class AdminUserDTO {

    private String _id;
    private Boolean isBanned;


    // Costruttori

    public AdminUserDTO() {
        // Costruttore vuoto necessario per MongoDB
    }

    public AdminUserDTO(String _id, Boolean isBanned) {
        this._id = _id;
        this.isBanned = isBanned;
    }

    public AdminUserDTO(Document document) {
        this._id = (String) document.get("_id");
        if(document.containsKey("isBanned"))
        {
            this.isBanned = true;
        }
        else
        {
            this.isBanned = false;
        }

    }

    // Getter e Setter

    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }
    public Boolean getIsBanned() {
        return isBanned;
    }

    public void setIsBanned(Boolean isBanned) {
        this.isBanned = isBanned;
    }






    // Altro

    @Override
    public String toString() {
        return "User {" +
                "id='" + _id + '\'' +
                "isBanned='" + isBanned + '\'' +

                '}';
    }

}
