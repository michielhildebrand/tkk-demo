package org.springfield.lou.application.types.domain;

import org.springfield.fs.FSList;
import org.springfield.fs.FsNode;
import org.springfield.mojo.linkedtv.Episode;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class Video {
    private String id, title, poster, src;
    private Integer duration;
    private Set<Chapter> chapters;

    private Video(String id, String t, Integer d, String p, String s, Set<Chapter> c) {
        this.id = id;
        this.title = t;
        this.duration = d;
        this.poster = p;
        this.src = s;
        this.chapters = c;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPoster() {
        return poster;
    }

    public String getSrc() {
        return src;
    }

    public Integer getDuration() {
        return duration;
    }

    public Set<Chapter> getChapters() {
        return chapters;
    }

    @Override
    public String toString() {
        return "Video{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", poster='" + poster + '\'' +
                ", src='" + src + '\'' +
                ", duration=" + duration +
                ", chapters=" + chapters +
                '}';
    }

    public static Video load(Episode e) {
        String id = e.getMediaResourceId();
        String t = e.getTitle();
        Integer d = e.getDuration();
        String p = e.getStillsUri();
        String s = e.getStreamUri();
        return new Video(id, t, d, p, s, loadChapters(e));
    }

    private static Set<Chapter> loadChapters(Episode e) {
        TreeSet<Chapter> chs = new TreeSet<Chapter>(new Comparator<Chapter>() {
            @Override
            public int compare(Chapter o1, Chapter o2) {
                return o1.getStartTime() - o2.getStartTime();
            }
        });
        TreeSet<Fragment> fgs = new TreeSet<Fragment>(new Comparator<Fragment>() {
            @Override
            public int compare(Fragment o1, Fragment o2) {
                return o1.getStartTime() - o2.getStartTime();
            }
        });

        FSList chapters = e.getChapters();
        List<FsNode> chaptersNode = chapters.getNodes();
        for (FsNode node : chaptersNode) {
            chs.add(Chapter.load(node));
        }
        FSList annotations = e.getAnnotations();
        List<FsNode> annotationsNodes = annotations.getNodes();
        for (FsNode node : annotationsNodes) {
            fgs.add(Fragment.load(node));
        }

        // Starting from the last chapter
        // add fragments with startime greater then ch.startTime
        for (Chapter ch : chs.descendingSet()) {
            for (Fragment fg : fgs) {
                if (fg.getStartTime() >= ch.getStartTime()) {
                    ch.addFragment(fg);
                }
            }
        }

        return chs;
    }

}