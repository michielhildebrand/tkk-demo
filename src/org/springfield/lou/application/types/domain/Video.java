package org.springfield.lou.application.types.domain;

import org.springfield.fs.FSList;
import org.springfield.fs.FsNode;
import org.springfield.mojo.linkedtv.Episode;

import java.util.ArrayList;
import java.util.List;

public class Video {
    String id, title, poster, src;
    Integer duration;
    List<Chapter> chapters;

    private Video(String id, String t, Integer d, String p, String s, List<Chapter> c) {
        this.id = id;
        this.title = t;
        this.duration = d;
        this.poster = p;
        this.src = s;
        this.chapters = c;
    }

    public static Video load(Episode e) {
        String id = e.getMediaResourceId();
        String t = e.getTitle();
        Integer d = e.getDuration();
        String p = e.getStillsUri();
        String s = e.getStreamUri();
        List<Chapter> c = loadChapters(e);
        return new Video(id, t, d, p, s, c);
    }

    private static List<Chapter> loadChapters(Episode e) {
        List<Chapter> ec = new ArrayList<Chapter>();
        List<Fragment> ef = new ArrayList<Fragment>();

        FSList chapters = e.getChapters();
        List<FsNode> chaptersNode = chapters.getNodes();
        for (FsNode node : chaptersNode) {
            ec.add(Chapter.load(node));
        }
        FSList annotations = e.getAnnotations();
        List<FsNode> annotationsNodes = annotations.getNodes();
        for (FsNode node : annotationsNodes) {
            ef.add(Fragment.load(node));
        }

        //TODO
        //starting from the last chapter all annotation with startime greater then chapter.starttime add to chapter

        return ec;
    }
}