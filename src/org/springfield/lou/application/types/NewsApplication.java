package org.springfield.lou.application.types;

import org.springfield.lou.application.Html5Application;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.lou.application.types.protocol.Message;
import org.springfield.lou.application.types.protocol.Serializer;
import org.springfield.lou.screen.Screen;
import org.springfield.mojo.linkedtv.Channel;
import org.springfield.mojo.linkedtv.Episode;

import java.util.List;

public class NewsApplication extends Html5Application {

    public NewsApplication(String id, String remoteReciever) {
        super(id, remoteReciever);
    }

    public NewsApplication(String id) {
        super(id);
    }

    private Episode choosenEpisode;

    @Override
    public void onNewScreen(Screen s) {
        String fixedrole = s.getParameter("role");
        if (fixedrole == null) {
            fixedrole = "main";
        }
        System.out.println("fixedrole = " + fixedrole);

        if (fixedrole.equals("main")) {
            String id = s.getParameter("id");
            if (id == null) {
                Channel ch = new Channel("linkedtv", "rbb"/*"S%26V"*/);
                List<Episode> curatedEpisodes = ch.getEpisodes(); //Returns a list containing all episodes for the domain/channel with the status CURATED
                choosenEpisode = ch.getLatestEpisode();
            } else {
                System.out.println("id = " + id);
                choosenEpisode = new Episode(id);
            }

            loadMainScreen(s);
        } else {
            loadSecondScreen(s);
        }
    }


    @Override
    public void putOnScreen(Screen s, String from, String content) {
        super.putOnScreen(s, from, content);
    }

    private void loadMainScreen(Screen s) {
        s.setRole("main");
        loadContent(s, "ngproxy");

        // TODO what's the difference between this put and putMsg below?
//        this.componentmanager.getComponent("video").put("app", "setVideo("+ choosenEpisode.getStreamUri() + ")");
//        this.componentmanager.getComponent("video").put("app", "setPoster("+ choosenEpisode.getStillsUri() +"/h/0/m/0/sec1.jpg)");

        Message msg = new Message("video", Video.load(choosenEpisode));
        String json = Serializer.toJson(msg);

        System.out.println("json = " + json);
        s.putMsg("ngproxy", "", json);
    }

    private void loadSecondScreen(Screen s) {
        s.setRole("secondary");
        loadContent(s, "ngproxy");
    }
}
