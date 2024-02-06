package it.unipi.dii.aide.lsmd.readrumble.user;

import org.springframework.data.annotation.Id;

public class UserDTO {

    private String _id;
    private String name;
    private String surname;



    // Costruttori

    public UserDTO() {
        // Costruttore vuoto necessario per MongoDB
    }

    public UserDTO(String _id, String name, String surname) {
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
        return "User {" +
                "id='" + _id + '\'' +
                ",  name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                '}';
    }

}
