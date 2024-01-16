package it.unipi.dii.aide.lsmd.readrumble.admin;

import org.springframework.data.annotation.Id;

public class AdminUserDTO {

    private String _id;
    private String name;
    private String surname;



    // Costruttori

    public AdminUserDTO() {
        // Costruttore vuoto necessario per MongoDB
    }

    public AdminUserDTO(String _id, String name, String surname) {
        this._id = _id;
        this.name = name;
        this.surname = surname;
    }

    // Getter e Setter

    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
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
        return "Utente {" +
                "id='" + _id + '\'' +
                ",  name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                '}';
    }

}
