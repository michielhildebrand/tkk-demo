package org.springfield.lou.application.types.gain;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;
import org.springfield.lou.application.types.protocol.Message;
import org.springfield.mojo.linkedtv.GAIN;

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
            }
        }

    }
}