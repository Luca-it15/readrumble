package it.unipi.dii.aide.lsmd.readrumble.user;

import org.springframework.data.annotation.Id;

public class AuthenticationUserDTO {

        private String name;
        private String surname;
        private String username;


        public AuthenticationUserDTO(String name, String surname, String username) {
            this.name = name;
            this.surname = surname;
            this.username = username;
        }

        // Getter e Setter
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
}

