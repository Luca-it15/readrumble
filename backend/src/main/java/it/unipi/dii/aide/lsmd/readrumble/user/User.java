package it.unipi.dii.aide.lsmd.readrumble.user;

import org.bson.conversions.Bson;
import org.springframework.data.annotation.Id;
import org.bson.Document;


public class User {

    private String _id;
    private String name;
    private String surname;

    private String password;

    // Costruttori

    public User() {
        // Costruttore vuoto necessario per MongoDB
    }

    public User(String _id, String name, String surname, String password) {
        this._id = _id;
        this.name = name;
        this.surname = surname;
        this.password = password;
    }
    public User(Document doc) {
        this._id = (String) doc.get("_id");
        this.name = (String) doc.get("name");
        this.surname = (String) doc.get("surname");
        this.password = (String) doc.get("password");
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

    public Document transformIntoDocument()
    {
        Document doc = new Document();
        doc.append("_id",this._id);
        doc.append("name",this.name);
        doc.append("surname",this.surname);
        doc.append("password",this.password);
        return doc;
    }
    // Altro

    @Override
    public String toString() {
        return "Utente {" +
                "id='" + _id + '\'' +
                ",  name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password +'\''+
                '}';
    }

    public String getUsername() {
        return _id;
    }
}
