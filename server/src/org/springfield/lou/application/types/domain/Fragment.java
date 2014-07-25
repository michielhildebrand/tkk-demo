package org.springfield.lou.application.types.domain;


import org.springfield.fs.FsNode;

import java.util.ArrayList;
import java.util.List;

public class Fragment {
    private transient FsNode originalAnnotation;

    private String id, locator, duration, title, type;
    private Integer startTime;

    private List<String> enrichments = new ArrayList<String>();

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

    public void addEnrichment(String e) {
        enrichments.add(e);
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
