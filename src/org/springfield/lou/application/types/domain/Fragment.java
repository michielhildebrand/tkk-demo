package org.springfield.lou.application.types.domain;


import org.springfield.fs.FsNode;

public class Fragment {
    String id, locator, duration, title, starttime, type;

    private Fragment(String id, String l, String d, String t, String s, String tp) {
        this.id = id;
        this.locator = l;
        this.duration = d;
        this.title = t;
        this.starttime = s;
        this.type = tp;
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
