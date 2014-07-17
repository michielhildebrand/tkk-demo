package org.springfield.lou.application.types.domain;


import org.springfield.fs.FsNode;

public class Fragment {
    private String id, locator, duration, title, type;
    private Integer startTime;

    private Fragment(String id, String l, String d, String t, String s, String tp) {
        this.id = id;
        this.locator = l;
        this.duration = d;
        this.title = t;
        this.startTime = new Double(s).intValue();
        this.type = tp;
    }

    public String getId() {
        return id;
    }

    public String getLocator() {
        return locator;
    }

    public String getDuration() {
        return duration;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public Integer getStartTime() {
        return startTime;
    }

    @Override
    public String toString() {
        return "Fragment{" +
                "id='" + id + '\'' +
                ", locator='" + locator + '\'' +
                ", duration='" + duration + '\'' +
                ", title='" + title + '\'' +
                ", type='" + type + '\'' +
                ", startTime=" + startTime +
                '}';
    }

    public static Fragment load(FsNode annotation) {
        String id = annotation.getId();
        String l = annotation.getProperty("locator");
        String d = annotation.getProperty("duration");
        String t = annotation.getProperty("title");
        String s = annotation.getProperty("starttime");
        String tp = annotation.getProperty("type");
        return new Fragment(id, l, d, t, s, tp);
    }
}
