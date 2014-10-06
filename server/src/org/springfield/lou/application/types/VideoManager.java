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

public class VideoManager {
    Map<String, Video> videoCache = new HashMap<String, Video>();

    public List<Video> getVideos(List<String> videoIds, boolean loadCurated) {
        System.out.println("VideoLoader.getVideos - " + videoIds + ", " + loadCurated);

        List<Video> result = new ArrayList<Video>();

        if (loadCurated) {
            List<Video> curatedVideos = readCuratedVideosJson();
            for (Video cv : curatedVideos) {
                if (videoIds.contains(cv.getId())) {
                    videoCache.put(cv.getId(), cv);
                    result.add(cv);
                }
            }
        } else {
            for (String videoId : videoIds) {
                if (videoCache.containsKey(videoId)) {
                    result.add(videoCache.get(videoId));
                } else {
                    Video v = new Video(new Episode(videoId));
                    videoCache.put(v.getId(), v);
                    result.add(v);
                }
            }
        }

        return result;
    }

    public Video getCachedVideo(String id) {
        return videoCache.get(id);
    }

    private List<Video> readCuratedVideosJson() {
        FileReader reader = null;
        try {
            reader = new FileReader("/opt/tkk/curated-videos.json");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        Type listType = new TypeToken<ArrayList<Video>>() {}.getType();
        return new Gson().fromJson(reader, listType);
    }
}
