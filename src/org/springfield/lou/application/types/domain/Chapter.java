package org.springfield.lou.application.types.domain;

import org.springfield.fs.FsNode;

import java.util.ArrayList;
import java.util.List;

public class Chapter {

    List<Fragment> fragments = new ArrayList<Fragment>();

    List<String> relatedContent = new ArrayList<String>();

    public void addFragment(Fragment f) {
        fragments.add(f);
    }

    private String id, duration, title;
    private Integer startTime;

    private Chapter(String id, String d, String t, String s) {
        this.id = id;
        this.duration = d;
        this.title = t;
        this.startTime = new Double(s).intValue();
    }

    public String getId() {
        return id;
    }

    public String getDuration() {
        return duration;
    }

    public String getTitle() {
        return title;
    }

    public Integer getStartTime() {
        return startTime;
    }

    @Override
    public String toString() {
        return "Chapter{" +
                "fragments=" + fragments +
                ", relatedContent=" + relatedContent +
                ", id='" + id + '\'' +
                ", duration='" + duration + '\'' +
                ", title='" + title + '\'' +
                ", startTime=" + startTime +
                '}';
    }

    public static Chapter load(FsNode chapter) {
        String id = chapter.getId();
        String d = chapter.getProperty("duration");
        String t = chapter.getProperty("title");
        String s = chapter.getProperty("starttime");
        return new Chapter(id, d, t, s);
    }


}
