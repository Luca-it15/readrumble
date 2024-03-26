package it.unipi.dii.aide.lsmd.readrumble.post;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class PostToRemove {

    private String parameter;
    private Date date_added;
    private boolean user;


    private static List<PostToRemove> ptr;
    public PostToRemove(String parameter, Date date_added, boolean user) {
        this.parameter = parameter;
        this.date_added = date_added;
        this.user = user;
    }

    public static List<PostToRemove> getPostToRemove() {
        if(ptr == null)
            ptr = new ArrayList<>();
        return ptr;
    }

    public static void addPostToRemove(PostToRemove post) {
        if(ptr == null)
            ptr = new ArrayList<>();
        ptr.add(post);
    }

    public String getParameter() {
        return parameter;
    }

    public void setParameter(String parameter) {
        this.parameter = parameter;
    }

    public Date getDate_added() {
        return date_added;
    }

    public void setDate_added(Date date_added) {
        this.date_added = date_added;
    }

    public boolean isUser() {
        return user;
    }

    public void setUser(boolean user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "PostToRemove{" +
                "parameter='" + parameter + '\'' +
                ", date_added='" + date_added + '\'' +
                ", user=" + user +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PostToRemove that = (PostToRemove) o;
        return user == that.user && Objects.equals(parameter, that.parameter) && Objects.equals(date_added, that.date_added);
    }

    @Override
    public int hashCode() {
        return Objects.hash(parameter, date_added, user);
    }
}
