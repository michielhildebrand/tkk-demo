package org.springfield.lou.application.types.domain;

import org.springfield.fs.FsNode;

import java.util.ArrayList;
import java.util.List;

public class Chapter {

    List<Fragment> fragments = new ArrayList<Fragment>();

    public void addFragment(Fragment f) {
        fragments.add(f);
    }

    String id, duration, title, starttime;

    private Chapter(String id, String d, String t, String s) {
        this.id = id;
        this.duration = d;
        this.title = t;
        this.starttime = s;
    }

    public static Chapter load(FsNode chapter) {
        String id = chapter.getId();
        String l = chapter.getProperty("locator");
        String d = chapter.getProperty("duration");
        String t = chapter.getProperty("title");
        String s = chapter.getProperty("starttime");
        String tp = chapter.getProperty("type");
        Chapter c = new Chapter(id, d, t, s);


        return c;
    }


}
