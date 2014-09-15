package org.springfield.lou.application.types.gain;

public class Event {
    private String action;
    private String user;
    private String screen;
    private String id;
    private Integer time;

    public String getAction() {
        return action;
    }

    public String getUser() {
        return user;
    }

    public String getScreen() {
        return screen;
    }

    public String getId() {
        return id;
    }

    public Integer getTime() {
        return time;
    }

    @Override
    public String toString() {
        return "Event{" +
                "action='" + action + '\'' +
                ", user='" + user + '\'' +
                ", screen='" + screen + '\'' +
                ", id='" + id + '\'' +
                ", time=" + time +
                '}';
    }
}
