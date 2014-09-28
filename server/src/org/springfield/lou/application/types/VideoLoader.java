package org.springfield.lou.application.types;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.mojo.linkedtv.Episode;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VideoLoader {
    Map<String, Video> originalVideos = new HashMap<String, Video>();

    public List<Video> getRecentVideos(List<String> videoIds, boolean loadCurated) {
        System.out.println("VideoLoader.getRecentVideos - " + videoIds + ", " + loadCurated);

        List<Video> result = new ArrayList<Video>();

        if (loadCurated) {
            List<Video> curatedVideos = getCuratedVideos();
            for (Video curatedVideo : curatedVideos) {
                if (videoIds.contains(curatedVideo.getId()))
                    result.add(curatedVideo);
            }
        } else {
            for (String videoId : videoIds) {
                if (originalVideos.containsKey(videoId)) {
                    result.add(originalVideos.get(videoId));
                } else {
                    Video v = new Video(new Episode(videoId));
                    originalVideos.put(v.getId(), v);
                    result.add(v);
                }
            }
        }

        return result;
    }

    private List<Video> getCuratedVideos() {
        FileReader reader = null;
        try {
            reader = new FileReader("/opt/tkk/curated-videos.json");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        Type listType = new TypeToken<ArrayList<Video>>() {
        }.getType();
        return new Gson().fromJson(reader, listType);
    }
}
