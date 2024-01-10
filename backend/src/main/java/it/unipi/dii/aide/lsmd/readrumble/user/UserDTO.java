package it.unipi.dii.aide.lsmd.readrumble.user;

import org.springframework.data.annotation.Id;

public class UserDTO {

    @Id
    private String id;

    private String name;
    private String surname;
    private String username;
    private String password;


    // Costruttori

    public UserDTO() {
        // Costruttore vuoto necessario per MongoDB
    }

    public UserDTO(String name, String surname, String username, String password) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.password = password;
    }

    // Getter e Setter

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
                "id='" + id + '\'' +
                ",  name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
