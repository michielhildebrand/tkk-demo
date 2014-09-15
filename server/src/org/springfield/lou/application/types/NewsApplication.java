package org.springfield.lou.application.types;

import org.springfield.lou.application.Html5Application;
import org.springfield.lou.application.types.gain.UserEvents;
import org.springfield.lou.application.types.protocol.Message;
import org.springfield.lou.application.types.protocol.Serializer;
import org.springfield.lou.screen.Screen;
import org.springfield.lou.user.User;

import java.util.List;

public class NewsApplication extends Html5Application {

    private static final boolean WORK_OFFLINE = true;

    private VideoLoader videoLoader;
    private User testUser;

    private static final int MAX_CAPACITY = 100;
    private UserEvents userEvents;


    public NewsApplication(String id) {
        super(id);

        videoLoader = new VideoLoader(WORK_OFFLINE);
        testUser = new User("Test User");
        userEvents = new UserEvents(MAX_CAPACITY);
    }

    public NewsApplication(String id, String remoteReceiver) {
        super(id, remoteReceiver);
    }

    @Override
    public void onNewScreen(Screen s) {
        loadContent(s, "ngproxy");

        String fixedrole = s.getParameter("role");
        if (fixedrole == null) {
            fixedrole = "main";
        }
        System.out.println("New screen with role = " + fixedrole);

        if (fixedrole.equals("main")) {
            loadMainScreen(s);
        } else {
            loadSecondScreen(s);
        }
    }

    private void loadMainScreen(Screen s) {
        s.setRole("main");

        // TODO what's the difference between this put and putMsg below?
        //this.componentmanager.getComponent("video").put("app", "setVideo("+ choosenEpisode.getStreamUri() + ")");
        //this.componentmanager.getComponent("video").put("app", "setPoster("+ choosenEpisode.getStillsUri() +"/h/0/m/0/sec1.jpg)");

        sendMsg(s, "video", videoLoader.getRecentVideos());

        sendMsg(s, "bookmark", testUser.getBookmarks());
    }

    private void loadSecondScreen(Screen s) {
        s.setRole("secondary");
    }

    @Override
    public void putData(String data) {
        int pos = data.indexOf("=");
        String put = data.substring(0, pos);
        String msgString = data.substring(pos + 1, data.length());

        System.out.println("Screen put = " + put);
        System.out.println("Screen msg = " + msgString);

        boolean propagate = true;
        if (put.contains("ngproxy")) {
            Message msg = Serializer.fromJson(msgString);
            if (msg.getTarget().equals("bookmark")) {
                propagate = false;
                List<String> bookmarks = (List<String>) msg.getData();
                //the client sends all the bookmarks every time, that is to avoid inconsistencies
                testUser.getBookmarks().clear();
                testUser.getBookmarks().addAll(bookmarks);
            } else if (msg.getTarget().equals("tracker")) {
                propagate = false;
                userEvents.put(msg);
            }
        }

        if (propagate) {
            super.putData(data);
        }
    }

    @Override
    public void put(String from, String content) {
        //TODO when is this put used ???
        System.out.println("put");
        super.put(from, content);
    }

    @Override
    public void putOnScreen(Screen s, String from, String content) {
        //TODO when is this putOnScreen used ???
        System.out.println("putOnScreen");
        super.putOnScreen(s, from, content);
    }

    private void sendMsg(Screen s, String target, Object data) {
        Message msg = new Message(target, data);
        String json = Serializer.toJson(msg);
        //System.out.println("json message = " + json);
        send(s, json);
    }

    private void send(Screen s, String m) {
        s.putMsg("ngproxy", "", m);
    }

}
