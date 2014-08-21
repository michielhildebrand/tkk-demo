package org.springfield.lou.application.types;

import org.springfield.lou.application.types.domain.Video;
import org.springfield.mojo.linkedtv.Episode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class VideoLoader {
    private final static List<String> EpisodesId = Arrays.asList("8a8187f2-3fc8-cb54-0140-7dccd76f0001",
            "8a8187f2-3fc8-cb54-0140-7dd099380002", "8a8187f2-3fc8-cb54-0140-7dd151100003",
            "8a8187f2-3fc8-cb54-0140-7dd247360004");

    // 8a8187f2-3fc8-cb54-0140-7dd2d0650005 - Tussen Kunst - 560
    // This episode has only 1 chapter without any fragment (skipping)

    // c44643ee-823e-476c-a099-bd28bcf1e56a - Koninklijke Porceleyne Fles (Delft)
    // Fetching chapters for this episode results in a 500 (skipping)

    private List<Video> videos = new ArrayList<Video>();

    public VideoLoader() {
        for (String s : EpisodesId) {
            System.out.println("Fetching episode = " + s);
            videos.add(new Video(new Episode(s)));
        }
    }

    public List<Video> getRecentVideos() {
        return videos;
    }
}
