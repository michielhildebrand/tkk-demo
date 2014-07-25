package org.springfield.lou.application.types.domain;

import org.springfield.fs.FSList;
import org.springfield.fs.FsNode;
import org.springfield.mojo.linkedtv.Episode;

import java.util.*;

public class Video {
    private transient Episode originalEpisode;

    private String id, title, shots, poster, src;
    private Integer duration;
    private Set<Chapter> chapters;

    public Video(Episode e) {
        this.originalEpisode = e;
        this.id = e.getMediaResourceId();
        this.title = e.getTitle();
        this.duration = e.getDuration();
        this.shots = e.getStillsUri();
        this.poster = e.getStillsUri() + "/h/0/m/0/sec10.jpg";
        this.src = e.getStreamUri();
        this.chapters = loadChapters(e);
    }

    public Episode getOriginalEpisode() {
        return originalEpisode;
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

    private Set<Chapter> loadChapters(Episode e) {
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
        List<Fragment> fgsToRemove = new ArrayList<Fragment>(fgs.size());

        FSList chapters = e.getChapters();
        List<FsNode> chaptersNode = chapters.getNodes();
        for (FsNode node : chaptersNode) {
            chs.add(new Chapter(node));
        }
        FSList annotations = e.getAnnotations();
        List<FsNode> annotationsNodes = annotations.getNodes();
        for (FsNode node : annotationsNodes) {
            fgs.add(new Fragment(node));
        }

        // Starting from the last chapter
        // add to the chapter fragments which starTime is greater then chapter.startTime
        for (Chapter ch : chs.descendingSet()) {
            for (Fragment fg : fgs) {
                if (fg.getStartTime() > ch.getStartTime()) {
                    ch.addFragment(fg);
                    fgsToRemove.add(fg);

                    FSList enrichments = e.getEnrichmentsFromAnnotation(fg.getOriginalAnnotation());
                    List<FsNode> enrichmentsNode = enrichments.getNodes();
                    for (FsNode node : enrichmentsNode) {
                        fg.addEnrichment(node.getProperty("locator"));
                    }
                }
            }

            //Take out fragment associated to the last chapter
            fgs.removeAll(fgsToRemove);
            fgsToRemove.clear();
        }

        return chs;
    }

}