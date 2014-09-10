package org.springfield.lou.application.types;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.mojo.linkedtv.Episode;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class VideoLoader {
    private final static List<String> EpisodesId = Arrays.asList(
            "8a8187f2-3fc8-cb54-0140-7dccd76f0001",
            "8a8187f2-3fc8-cb54-0140-7dd151100003",
            "8a8187f2-3fc8-cb54-0140-7dd247360004",
            "8a8187f2-3fc8-cb54-0140-7dd099380002",
            "953b4d09-e828-4623-b9ff-be3072411a98",
            "8a8187f2-3fc8-cb54-0140-7dd2d0650005",
            "c44643ee-823e-476c-a099-bd28bcf1e56a");

    private List<Video> videos;

    public VideoLoader(boolean offline) {
        if (!offline) {
            videos = new ArrayList<Video>();
            for (String s : EpisodesId) {
                System.out.println("Fetching episode = " + s);
                videos.add(new Video(new Episode(s)));
            }
        } else {
            FileReader reader = null;
            try {
                reader = new FileReader("/opt/tkk/curated-videos.json");
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            Type listType = new TypeToken<ArrayList<Video>>() {}.getType();
            videos = new Gson().fromJson(reader, listType);
        }
    }

    public List<Video> getRecentVideos() {
        return videos;
    }
}
