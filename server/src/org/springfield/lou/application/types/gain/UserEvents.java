package org.springfield.lou.application.types.gain;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;
import org.springfield.lou.application.types.domain.Chapter;
import org.springfield.lou.application.types.domain.Fragment;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.lou.application.types.protocol.Message;
import org.springfield.mojo.linkedtv.Episode;
import org.springfield.mojo.linkedtv.GAIN;
import org.springfield.mojo.linkedtv.GAINObjectEntity;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class UserEvents {
    private BlockingQueue<Message> queue;
    private GAIN tracker;
    private Gson deserializer;
    private Type eventsType;

    public UserEvents(int maxCapacity) {
        queue = new ArrayBlockingQueue<Message>(maxCapacity);
        tracker = new GAIN("LINKEDTV-TEST", "Culture");
        deserializer = new GsonBuilder().disableHtmlEscaping().create();
        eventsType = new TypeToken<ArrayList<Event>>() {}.getType();

        // run the consumer thread, there could be more than one consumer
        Thread th = new Thread(new QueueProcessor(), "QueueProcessor");
        th.setDaemon(true); // don't hold the VM open for this thread
        th.start();
    }

    public void put(Message msg) {
        try {
            queue.put(msg);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private class QueueProcessor implements Runnable {
        @Override
        public void run() {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    signal(queue.take());
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private void signal(Message msg) {
        JsonElement element = deserializer.toJsonTree(msg.getData(), eventsType);
        List<Event> events = deserializer.fromJson(element, eventsType);
        for (Event event : events) {
            System.out.println("Track event = " + event);
            String a = event.getAction();
            if (a.equals("user_login")) {
                tracker.user_login(event.getUser(), event.getScreen());
            } else if (a.equals("user_logout")) {
                tracker.user_logout(event.getUser(), event.getScreen());
            } else if (a.equals("user_bookmark")) {
                tracker.user_bookmark(event.getUser(), event.getId(), event.getScreen());
            } else if (a.equals("player_play")) {
                tracker.player_play(event.getScreen(), event.getId(), event.getTime().toString());
            } else if (a.equals("player_pause")) {
                tracker.player_pause(event.getScreen(), event.getId(), event.getTime().toString());
            } else if (a.equals("player_stop")) {
                tracker.player_stop(event.getScreen(), event.getId(), event.getTime().toString());
            } else if (a.equals("player_enrich")) {
                List<GAINObjectEntity> entities = getGainEntities(event.getId(), event.getTime());
                if (entities.size() > 0) {
                    tracker.updateEntities(entities);
                    tracker.sendKeepAliveRequest(event.getTime().toString());
                    entities.clear();
                }
            }
        }
    }

    private List<GAINObjectEntity> getGainEntities(String videoId, Integer selectedTime) {
        System.out.println("UserEvents.getGainEntities  - " + videoId + ", " + selectedTime);

        Video video = new Video(new Episode(videoId));
        Chapter selectedChapter = findChapter(video, selectedTime);

        List<GAINObjectEntity> entityList = new ArrayList<GAINObjectEntity>();

        if (selectedChapter != null) {
            entityList.add(new GAINObjectEntity(selectedChapter.getOriginalChapter()));
            for (Fragment fragment : selectedChapter.getFragments()) {
                entityList.add(new GAINObjectEntity(fragment.getOriginalAnnotation()));
            }
        } else {
            System.out.println("Chapter NOT found!");
        }

        return entityList;
    }

    private Chapter findChapter(Video v, Integer time) {
        for (Chapter chapter : v.getChapters()) {
            if (chapter.getStartTime() >= time) {
                return chapter;
            }
        }
        return null;
    }
}
