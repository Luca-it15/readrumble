package it.unipi.dii.aide.lsmd.readrumble.utils;

public class FollowersAndFollowees {
    private int followers;
    private int followees;

    public FollowersAndFollowees(int followers, int followees) {
        this.followers = followers;
        this.followees = followees;
    }

    public int getFollowers() {
        return followers;
    }

    public void setFollowers(int followers) {
        this.followers = followers;
    }

    public int getFollowees() {
        return followees;
    }

    public void setFollowees(int followees) {
        this.followees = followees;
    }
}
