package org.springfield.lou.application.types;

import org.springfield.lou.application.Html5Application;
import org.springfield.lou.screen.Screen;
import org.springfield.mojo.linkedtv.Episode;

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
            System.out.println("id = " + id);

            choosenEpisode = new Episode(id);
            System.out.println("e = " + choosenEpisode.getTitle());

            //fetch episode chapters, fetch episode annotations
            // link annotations and chapters based on start-end time



//            FSList annotations = e.getAnnotations();
//            System.out.println("path = " + annotations.getPath());
//
//            List<FsNode> nodes = annotations.getNodes();
//
//            String allContent = "fake";
//
//            for (int i = 0; i < nodes.size(); i++) {
//                FsNode node = nodes.get(i);
//
//            }

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

        String msg = "{\"target\": \"screen\", \"data\": \""+ choosenEpisode.getStreamUri() +"\"}";
        s.putMsg("ngproxy", "", msg);
    }

    private void loadSecondScreen(Screen s) {
        s.setRole("secondary");
        loadContent(s, "ngproxy");
//
//        String allContent = "[{chapter: 'politics', annotations: [{start: 34, end: 234, label: 'snowden', thumb: 'image url' }] }]";
//        s.putMsg("rawdata", "", allContent);
    }
}
