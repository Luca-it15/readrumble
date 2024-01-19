package it.unipi.dii.aide.lsmd.readrumble.utils;

public class UserNotExistsException extends Exception{
    private String username;
    public  UserNotExistsException(String username) {
        super("the user: " + username + " not exits");
    }
}
