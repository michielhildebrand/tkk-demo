package org.springfield.lou.application.types.domain;

import org.springfield.fs.FsNode;

import java.util.ArrayList;
import java.util.List;

public class Chapter {
    private transient FsNode originalChapter;

    private String id, duration, title;
    private Integer startTime;
    private List<String> artworks;
    private List<String> backgrounds;
    private List<Fragment> fragments = new ArrayList<Fragment>();

    public Chapter(FsNode chapter) {
        this.originalChapter = chapter;
        this.id = chapter.getId();
        this.duration = chapter.getProperty("duration");
        this.title = chapter.getProperty("title");
        this.startTime = new Double(chapter.getProperty("starttime")).intValue();
    }

    public FsNode getOriginalChapter() {
        return originalChapter;
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

    public List<String> getArtworks() {
        return artworks;
    }

    public List<String> getBackgrounds() {
        return backgrounds;
    }

    public void addFragment(Fragment f) {
        fragments.add(f);
    }

    public int nrOfFragments() {
        return fragments.size();
    }

    public List<Fragment> getFragments() {return fragments;}

    @Override
    public String toString() {
        return "Chapter{" +
                "fragments=" + fragments +
                ", id='" + id + '\'' +
                ", duration='" + duration + '\'' +
                ", title='" + title + '\'' +
                ", startTime=" + startTime +
                '}';
    }
}
