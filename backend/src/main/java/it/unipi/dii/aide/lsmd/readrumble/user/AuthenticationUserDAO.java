package it.unipi.dii.aide.lsmd.readrumble.user;

import java.util.ArrayList;
import java.util.List;

public class AuthenticationUserDAO {
   private static List<AuthenticationUserDTO> authenticationUsers;

    public static void addAuthenticationUser(AuthenticationUserDTO authenticationUser) {
        if (AuthenticationUserDAO.authenticationUsers == null) {
            AuthenticationUserDAO.authenticationUsers = new ArrayList<>();
        }
        AuthenticationUserDAO.authenticationUsers.add(authenticationUser);
    }

    /**
     * given the username, the function return the relative AuthenticationUserDTO
     * @param username
     * @return authenticationUser if the user is within the arraylist otherwise the function return null
     */
    public static AuthenticationUserDTO getAuthenticationUser(String username) {
        if (AuthenticationUserDAO.authenticationUsers == null) {
            return null;
        }
            for (AuthenticationUserDTO authenticationUser : authenticationUsers) {
                if (authenticationUser.getUsername().equals(username)) {
                    return authenticationUser;
                }
            }
            return null;
    }

}
