package it.unipi.dii.aide.lsmd.readrumble.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Users")
public class User {

    private String _id;
    private String name;
    private String surname;

    private String password;

    // Costruttori

    public User() {
        // Costruttore vuoto necessario per MongoDB
    }

    public User(String _id, String name, String surname) {
        this._id = _id;
        this.name = name;
        this.surname = surname;
        this.password = password;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getUsername() {
        return _id;
    }
}
