package it.unipi.dii.aide.lsmd.readrumble.admin;

import org.bson.Document;
import org.springframework.data.annotation.Id;

public class AdminUserDTO {

    private String _id;
    private Boolean isBanned;
    private String name;
    private String surname;

    // Costruttori

    public AdminUserDTO() {
        // Costruttore vuoto necessario per MongoDB
    }

    public AdminUserDTO(String _id, Boolean isBanned,String name, String surname) {
        this._id = _id;
        this.isBanned = isBanned;
        this.name = name;
        this.surname = surname;
    }

    public AdminUserDTO(Document document) {
        this._id = (String) document.get("_id");
        this.name = (String) document.get("name");
        this.surname = (String) document.get("surname");
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
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }




    // Altro

    @Override
    public String toString() {
        return "User {" +
                "id='" + _id + '\'' +
                "name='" + name + '\'' +
                "surname='" + surname + '\'' +
                "isBanned='" + isBanned + '\'' +
                '}';
    }

}
