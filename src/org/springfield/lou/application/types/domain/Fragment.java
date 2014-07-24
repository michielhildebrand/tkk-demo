package org.springfield.lou.application.types.domain;


import org.springfield.fs.FsNode;

public class Fragment {
    private transient FsNode originalAnnotation;

    private String id, locator, duration, title, type;
    private Integer startTime;

    public Fragment(FsNode annotation) {
        this.originalAnnotation = annotation;
        this.id = annotation.getId();
        this.locator = annotation.getProperty("locator");
        this.duration = annotation.getProperty("duration");
        this.title = annotation.getProperty("title");
        this.startTime = new Double(annotation.getProperty("starttime")).intValue();
        this.type = annotation.getProperty("type");
    }

    public FsNode getOriginalAnnotation() {
        return originalAnnotation;
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
}