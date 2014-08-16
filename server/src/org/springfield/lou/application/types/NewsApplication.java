package org.springfield.lou.application.types;

import org.springfield.lou.application.Html5Application;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.lou.application.types.gain.UserEvents;
import org.springfield.lou.application.types.protocol.Message;
import org.springfield.lou.application.types.protocol.Serializer;
import org.springfield.lou.screen.Screen;
import org.springfield.lou.user.User;
import org.springfield.mojo.linkedtv.Channel;
import org.springfield.mojo.linkedtv.Episode;

import java.util.List;

public class NewsApplication extends Html5Application {

    private static final boolean WORK_OFFLINE = true;

    private Episode choosenEpisode;
    private User testUser;

    private static final int MAX_CAPACITY = 100;
    private UserEvents userEvents;


    public NewsApplication(String id) {
        super(id);

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
        System.out.println("fixedrole = " + fixedrole);

        if (fixedrole.equals("main")) {
            String id = s.getParameter("id");
            if (id == null) {
                Channel ch = new Channel("linkedtv", "rbb"/*"S%26V"*/);
                choosenEpisode = ch.getLatestEpisode();

                //Returns a list containing all episodes for the domain/channel with the status CURATED
                //List<Episode> curatedEpisodes = ch.getEpisodes();
            } else {
                System.out.println("id = " + id);
                if (!WORK_OFFLINE) {
                    choosenEpisode = new Episode(id);
                }
            }
            loadMainScreen(s);
        } else {
            loadSecondScreen(s);
        }
    }

    @Override
    public void putData(String data) {
        int pos = data.indexOf("=");
        String put = data.substring(0, pos);
        String msgString = data.substring(pos + 1, data.length());

        Message msg = Serializer.fromJson(msgString);
        userEvents.put(msg);
        if (msg.getTarget().equals("bookmark")) {
            List<String> bookmarks = (List<String>) msg.getData();
            //the client sends all the bookmarks every time, that is to avoid inconsistencies
            testUser.getBookmarks().clear();
            testUser.getBookmarks().addAll(bookmarks);
        } else {
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

    private void loadMainScreen(Screen s) {
        s.setRole("main");

        // TODO what's the difference between this put and putMsg below?
        //this.componentmanager.getComponent("video").put("app", "setVideo("+ choosenEpisode.getStreamUri() + ")");
        //this.componentmanager.getComponent("video").put("app", "setPoster("+ choosenEpisode.getStillsUri() +"/h/0/m/0/sec1.jpg)");

        if (!WORK_OFFLINE) {
            sendMsg(s, "video", new Video(choosenEpisode));
        } else {
            send(s, getOfflineVideo());
        }

        sendMsg(s, "bookmark", testUser.getBookmarks());
    }

    private void loadSecondScreen(Screen s) {
        s.setRole("secondary");
    }


    private void sendMsg(Screen s, String target, Object data) {
        Message msg = new Message(target, data);
        send(s, Serializer.toJson(msg));
    }

    private void send(Screen s, String m) {
        s.putMsg("ngproxy", "", m);
    }

    private String getOfflineVideo() {
        return "{\n" +
                "  \"target\": \"video\",\n" +
                "  \"data\": {\n" +
                "    \"id\": \"8a8187f2-3fc8-cb54-0140-7dccd76f0001\",\n" +
                "    \"title\": \"Tussen Kunst - 640\",\n" +
                "    \"shots\": \"http://tkk.dev/video/shots/1\",\n" +
                "    \"poster\": \"http://tkk.dev/video/shots/1/h/0/m/0/sec10.jpg\",\n" +
                "    \"src\": \"http://tkk.dev/video/raw.mp4\",\n" +
                "    \"duration\": 2949590,\n" +
                "    \"chapters\": [\n" +
                "      {\n" +
                "        \"id\": \"2\",\n" +
                "        \"duration\": \"180000.0\",\n" +
                "        \"title\": \"Introduction\",\n" +
                "        \"startTime\": 0,\n" +
                "        \"fragments\": [\n" +
                "          {\n" +
                "            \"id\": \"0a201ce2-eca0-11e3-a276-005056a7235c\",\n" +
                "            \"locator\": \" http://nl.dbpedia.org/resource/Nelleke_van_der_Krogt\",\n" +
                "            \"duration\": \"298000.0\",\n" +
                "            \"title\": \"Nelleke van der Krogt\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 1000,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"4ae7487e-f6df-11e3-87f6-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"290000.0\",\n" +
                "            \"title\": \"Tin coffee decanter\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 5000,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"59198c4a-f6df-11e3-a577-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"280000.0\",\n" +
                "            \"title\": \"A tin coffee decanter\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 10000,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"64453d94-f6df-11e3-9ad4-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"240000.0\",\n" +
                "            \"title\": \"A tin coffee decanter\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 30000,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"7ef7e878-eca1-11e3-99e1-005056a7235c\",\n" +
                "            \"locator\": \"http://nl.dbpedia.org/resource/Nelleke_van_der_Krogt\",\n" +
                "            \"duration\": \"11000.0\",\n" +
                "            \"title\": \"Nelleke van der Krogt\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 44000,\n" +
                "            \"enrichments\": [\"https://www.youtube.com/watch?v=uD0ot1ccbZw\", \"http://avro.nl/tussenkunstenkitsch/over/nelleke_van_der_krogt.aspx\"]\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"4c9f6450-eca1-11e3-acd4-005056a7235c\",\n" +
                "            \"locator\": \"http://nl.dbpedia.org/resource/Museum_Martena\",\n" +
                "            \"duration\": \"37000.0\",\n" +
                "            \"title\": \"Museum Martena\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 56000,\n" +
                "            \"enrichments\": [\"https://de.foursquare.com/v/museum-martena-franeker-frysl%C3%A2n/4c628a0769a1c9b6cccc38a4\"]\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"361cba9e-eca0-11e3-89e2-005056a7235c\",\n" +
                "            \"locator\": \"http://nl.dbpedia.org/resource/Franeker\",\n" +
                "            \"duration\": \"3200.0046\",\n" +
                "            \"title\": \"Franeker\",\n" +
                "            \"type\": \"Location\",\n" +
                "            \"startTime\": 69919,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"0a01e4d0-f172-11e3-8114-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"125000.0\",\n" +
                "            \"title\": \"A tin coffee decanter\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 160000,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"e7eed88e-f6e0-11e3-87f6-005056a7235c\",\n" +
                "            \"locator\": \"http://dbpedia.org/resource/Test_cricket\",\n" +
                "            \"duration\": \"5000.0\",\n" +
                "            \"title\": \"Test cricket\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 185000,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"cdba0bb8-e00c-11e3-95a7-005056a7235c\",\n" +
                "            \"locator\": \"http://dbpedia.org/resource/Jan_Altink\",\n" +
                "            \"duration\": \"180000.0\",\n" +
                "            \"title\": \"Jan Altink\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 285000,\n" +
                "            \"enrichments\": [\"https://www.youtube.com/watch?v=7cFmprcLzVo\", \"https://www.flickr.com/search?sort=relevance&text=jan%20altink\", \"http://www.europeana.eu/portal/record/2021623/index_php_a_1_id_24_s_1_rg_1_rg_id_480_rg_b_1.html\"]\n" +
                "          }\n" +
                "        ]\n" +
                "      },\n" +
                "      {\n" +
                "        \"id\": \"3\",\n" +
                "        \"duration\": \"300000.0\",\n" +
                "        \"title\": \"Chapter2\",\n" +
                "        \"startTime\": 300000,\n" +
                "        \"fragments\": [\n" +
                "          {\n" +
                "            \"id\": \"c1dc27ba-1359-11e4-a082-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"4000.0\",\n" +
                "            \"title\": \"Groninger Ploeg\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 327640,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"44268d96-1350-11e4-8d2b-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"4598.999\",\n" +
                "            \"title\": \"Jan Altink\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 400839,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"c4a971c8-1359-11e4-b4fc-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"3638.977\",\n" +
                "            \"title\": \"Friesland\",\n" +
                "            \"type\": \"Location\",\n" +
                "            \"startTime\": 550280,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"f2cfc0c8-c63a-11e3-a7cd-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"4558.96\",\n" +
                "            \"title\": \"schuif\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 1804280,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"edeef272-c63a-11e3-95ec-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"3041.0156\",\n" +
                "            \"title\": \"zon\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 1844119,\n" +
                "            \"enrichments\": []\n" +
                "          }\n" +
                "        ]\n" +
                "      },\n" +
                "      {\n" +
                "        \"id\": \"1\",\n" +
                "        \"duration\": \"237000.0\",\n" +
                "        \"title\": \"Silver tea jar\",\n" +
                "        \"startTime\": 2157000,\n" +
                "        \"fragments\": [\n" +
                "          {\n" +
                "            \"id\": \"589390e2-f79b-11e3-87f6-005056a7235c\",\n" +
                "            \"locator\": \"http://dbpedia.org/resource/Silver\",\n" +
                "            \"duration\": \"144000.0\",\n" +
                "            \"title\": \"Zilveren theebus\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 2165000,\n" +
                "            \"enrichments\": [\"http://europeana.eu/portal/search.html?query=zilver+theebus&rows=24\"]\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"2e6b620e-f79b-11e3-a224-005056a7235c\",\n" +
                "            \"locator\": \"http://dbpedia.org/resource/Tea\",\n" +
                "            \"duration\": \"110000.0\",\n" +
                "            \"title\": \"Friese theebus\",\n" +
                "            \"type\": \"Food\",\n" +
                "            \"startTime\": 2199000,\n" +
                "            \"enrichments\": [\"http://europeana.eu/portal/search.html?query=friesland+theebus&rows=24\"]\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"20efcf98-f791-11e3-9020-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"6641.1133\",\n" +
                "            \"title\": \"Friesland\",\n" +
                "            \"type\": \"Location\",\n" +
                "            \"startTime\": 2234159,\n" +
                "            \"enrichments\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"10f3d3a0-f791-11e3-99a9-005056a7235c\",\n" +
                "            \"locator\": \"http://nl.wikipedia.org/wiki/Meesterteken\",\n" +
                "            \"duration\": \"4358.8867\",\n" +
                "            \"title\": \"Meesterteken\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 2285280,\n" +
                "            \"enrichments\": [\"http://www.925-1000.com/Fnetherlands_Date_Code.html\"]\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"89666b4a-f79b-11e3-a577-005056a7235c\",\n" +
                "            \"locator\": \"http://dbpedia.org/resource/Friesland\",\n" +
                "            \"duration\": \"15000.0\",\n" +
                "            \"title\": \"Friese zilversmeden\",\n" +
                "            \"type\": \"Place\",\n" +
                "            \"startTime\": 2294000,\n" +
                "            \"enrichments\": [\"http://europeana.eu/portal/search.html?query=zilversmid+friesland&rows=24\", \"http://www.friesmuseum.nl/het-museum/collectie/iconen/popta-zilver\"]\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": \"0b8759c8-f791-11e3-8ec5-005056a7235c\",\n" +
                "            \"locator\": \"\",\n" +
                "            \"duration\": \"4439.9414\",\n" +
                "            \"title\": \"zilver\",\n" +
                "            \"type\": \"Thing\",\n" +
                "            \"startTime\": 2302239,\n" +
                "            \"enrichments\": []\n" +
                "          }\n" +
                "        ]\n" +
                "      }\n" +
                "    ]\n" +
                "  }\n" +
                "}";
    }
}
